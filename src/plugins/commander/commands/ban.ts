import { Command, CommandResponse } from "../structs/Command.js";
import { DotsimusClient } from "../../../structs/DotsimusClient.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, CommandInteraction, GuildMember, MessageButton, DiscordAPIError } from "discord.js";
import confirmation from "../../../structs/Confirmation.js";
import { until } from "@open-draft/until";
import { nanoid } from "nanoid";

export default class BanCommand extends Command {
	constructor(bot: DotsimusClient) {
		super(bot);

		this.name = "ban";
		this.description = "Bans a member.";
		this.schema = new SlashCommandBuilder()
			.addUserOption(option =>
				option
					.setName("member")
					.setDescription("Member to ban")
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName("reason")
					.setDescription("Reason for ban")
			);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(interaction: CommandInteraction): Promise<CommandResponse | void> {
		const member = interaction.options.getMember("member") as GuildMember;
		const reason = interaction.options.getString("reason", false) as string | undefined;

		if (!(interaction.member?.permissions as Permissions).serialize().BAN_MEMBERS) {
			return interaction.reply({
				content: "You do not have the sufficient permissions to run this command.",
			});
		}

		if (!member) return interaction.reply({
			content: "Invalid member provided",
		});

		await interaction.deferReply();

		const cancelId = nanoid();
		const banId = nanoid();

		const [error, res] = await until(() => confirmation(
			`Ban ${member.user.username}?`,
			interaction,
			[
				new MessageButton()
					.setCustomId(cancelId)
					.setStyle("PRIMARY")
					.setLabel("Cancel"),
				new MessageButton()
					.setCustomId(banId)
					.setStyle("DANGER")
					.setLabel("Confirm"),
			]
		));

		if (error) return interaction.reply({
			content: `Ban was not confirmed and is now cancelled.`,
			ephemeral: true,
		});

		if (res?.customId !== banId) {
			return res!.update({
				content: "Ban cancelled.",
				components: [],
			});
		}

		try {
			await interaction.guild?.members.ban(member, { reason });
			await interaction.editReply({
				content: "User was banned.",
				components: [],
			});
		} catch (e: unknown) {
			if (e instanceof DiscordAPIError) {
				if (e.code === 50013) {
					await interaction.editReply({
						content: `Missing permissions to ban ${member.user.username}`,
						components: [],
					});
				}
			}
			await interaction.editReply({
				content: "Error occurred while banning",
				components: [],
			});
		}
	}
}

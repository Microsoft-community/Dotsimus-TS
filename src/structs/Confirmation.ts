import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js";

export default async function confirmation(
	question: string,
	interaction: CommandInteraction,
	buttons: MessageButton[],
	options?: {
		time: 60000,
		max: 1,
	}
): Promise<ButtonInteraction | undefined> {
	await interaction.editReply({
		content: question,
		components: [
			new MessageActionRow().addComponents(...buttons),
		],
	});

	const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
	return interaction.channel?.awaitMessageComponent<"BUTTON">({
		filter,
		componentType: "BUTTON",
		time: options?.time || 15000,
	});
}

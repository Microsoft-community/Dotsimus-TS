export const constants = {
	missingPerms: "You do not have the sufficient permissions to run this command.",
	unknownCommand: "The given command does not exist.",
	invalidMember: "Invalid member was provided.",

	cmds: {
		ban: {
			timedOut: "Ban was not confirmed and is now cancelled.",
			cancelled: "Ban cancelled.",
			success: "User was banned.",
			prompt: "Ban ",
			missingPerms: "Missing perms to ban ",
			error: "Error occurred while banning",
		},
	},
} as const;

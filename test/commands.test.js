import assert from "node:assert/strict";
import { test } from "node:test";
import { actorFromInteraction, buildDuneCommand, extractRoleIds, isAllowed } from "../src/commands.js";

test("buildDuneCommand exposes read-only subcommands only", () => {
  const command = buildDuneCommand().toJSON();
  const subcommands = command.options.map((option) => option.name).sort();
  assert.deepEqual(subcommands, ["health", "readiness", "services", "status"]);
});

test("extractRoleIds supports discord.js role cache shape", () => {
  const interaction = {
    member: {
      roles: {
        cache: new Map([["role-a", {}], ["role-b", {}]])
      }
    }
  };

  assert.deepEqual(extractRoleIds(interaction), ["role-a", "role-b"]);
});

test("isAllowed permits all users when no allow-list is configured", () => {
  assert.equal(isAllowed({}, []), true);
});

test("isAllowed enforces configured role IDs", () => {
  const interaction = { member: { roles: ["role-a"] } };
  assert.equal(isAllowed(interaction, ["role-b"]), false);
  assert.equal(isAllowed(interaction, ["role-a"]), true);
});

test("actorFromInteraction emits minimal Discord context", () => {
  const actor = actorFromInteraction({
    user: { id: "user-1" },
    guildId: "guild-1",
    channelId: "channel-1",
    member: { roles: ["role-1"] }
  });

  assert.deepEqual(actor, {
    userId: "user-1",
    guildId: "guild-1",
    channelId: "channel-1",
    roleIds: ["role-1"]
  });
});

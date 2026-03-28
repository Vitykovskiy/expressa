const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createConfigFromEnv } = require("../src/app");

test("createConfigFromEnv requires ADMIN_TELEGRAM_ID when DISABLE_TG_AUTH is false", () => {
  assert.throws(
    () => createConfigFromEnv({ DISABLE_TG_AUTH: "false" }),
    /ADMIN_TELEGRAM_ID is required/
  );
});

test("createConfigFromEnv defaults admin id in test mode when ADMIN_TELEGRAM_ID is empty", () => {
  const config = createConfigFromEnv({ DISABLE_TG_AUTH: "true", ADMIN_TELEGRAM_ID: "  " });
  assert.equal(config.disableTgAuth, true);
  assert.equal(config.adminTelegramId, "1001");
});

test("createConfigFromEnv keeps explicit admin id in test mode", () => {
  const config = createConfigFromEnv({ DISABLE_TG_AUTH: "true", ADMIN_TELEGRAM_ID: "777" });
  assert.equal(config.disableTgAuth, true);
  assert.equal(config.adminTelegramId, "777");
});

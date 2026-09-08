import assert from 'node:assert/strict';
import { test } from 'node:test';

test('Luna chat preserves the output budget and supports explicit model overrides', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  const requests = [];
  process.env.OPENAI_API_KEY = 'test-key';
  process.env.OPENAI_MAX_TOKENS = '321';
  delete process.env.OPENAI_CHAT_MODEL;
  globalThis.fetch = async (_url, init) => {
    requests.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ choices: [{ message: { content: '  Guten Tag!  ' } }] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  };
  try {
    const defaults = await import('./chat.mjs?test=default');
    assert.equal(await defaults.buildChatReply([{ role: 'user', content: 'Hallo' }]), 'Guten Tag!');
    assert.equal(requests[0].model, 'gpt-5.6-luna');
    assert.equal(requests[0].reasoning_effort, 'none');
    assert.equal(requests[0].max_completion_tokens, 321);
    assert.equal('max_tokens' in requests[0], false);
    assert.equal('temperature' in requests[0], false);
    assert.equal(requests[0].messages.at(-1).content, 'Hallo');
    process.env.OPENAI_CHAT_MODEL = 'gpt-4o-mini';
    const override = await import('./chat.mjs?test=override');
    await override.buildChatReply([{ role: 'user', content: 'Hallo' }]);
    assert.equal(requests[1].model, 'gpt-4o-mini');
    assert.equal('reasoning_effort' in requests[1], false);
    assert.equal(requests[1].temperature, 0.3);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of ['OPENAI_API_KEY', 'OPENAI_MAX_TOKENS', 'OPENAI_CHAT_MODEL']) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  }
});

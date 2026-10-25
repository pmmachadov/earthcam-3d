import fs from 'node:fs';
import https from 'node:https';

function checkLiveStream(id) {
  return new Promise((resolve) => {
    const req = https.get(
      `https://www.youtube.com/watch?v=${id}`,
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9', Cookie: 'SOCS=CAI; CONSENT=YES+1' } },
      (res) => {
        let html = '';
        res.on('data', (chunk) => (html += chunk));
        res.on('end', () => {
          const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});(?:var|<\/script>)/);
          if (!match) return resolve({ id, ok: false, reason: 'No player response data' });
          try {
            const data = JSON.parse(match[1]);
            const status = data.playabilityStatus || {};
            const isLive = Boolean(data.videoDetails && data.videoDetails.isLive);
            resolve({
              id,
              ok: status.status === 'OK',
              live: isLive,
              embeddable: status.playableInEmbed !== false,
              title: data.videoDetails?.title || 'Unknown',
              reason: status.reason || '',
            });
          } catch {
            resolve({ id, ok: false, reason: 'Failed to parse player JSON' });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ id, ok: false, reason: err.message }));
  });
}

async function main() {
  console.log('🔍 Checking US Live Cams status...\n');
  const content = fs.readFileSync(new URL('../src/models/mockWebcams.ts', import.meta.url), 'utf8');
  const matches = [...content.matchAll(/cam\('([\w-]{11})',\s*'([^']+)',\s*'([^']+)'/g)];

  if (matches.length === 0) {
    console.error('❌ No webcam definitions found in mockWebcams.ts');
    process.exit(1);
  }

  let healthyCount = 0;
  for (const m of matches) {
    const [, ytId, camId, title] = m;
    const res = await checkLiveStream(ytId);
    const isGood = res.ok && res.live && res.embeddable;
    if (isGood) healthyCount++;

    const icon = isGood ? '✅' : '⚠️ ';
    const flags = `[live=${res.live ? 'yes' : 'NO'}, embed=${res.embeddable ? 'yes' : 'NO'}]`;
    console.log(`${icon} ${title.padEnd(36)} ${flags} ${res.reason ? `(${res.reason})` : ''}`);
  }

  console.log(`\n📊 Summary: ${healthyCount}/${matches.length} cameras active and verified.`);
}

main();

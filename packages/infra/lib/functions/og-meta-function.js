function handler(event) {
  var request = event.request;
  var ua = (request.headers['user-agent'] && request.headers['user-agent'].value) || '';
  var isBot = /facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|googlebot|bingbot|applebot/i.test(ua);

  if (!isBot) {
    return request;
  }

  // Don't intercept static asset requests (images, scripts, stylesheets, etc.)
  var path = request.uri;
  if (/\.\w+$/.test(path) && !/\.html?$/.test(path)) {
    return request;
  }
  var meta = getMetaForPath(path);

  return {
    statusCode: 200,
    statusDescription: 'OK',
    headers: {
      'content-type': { value: 'text/html; charset=utf-8' },
      'cache-control': { value: 'max-age=3600' }
    },
    body: '<!DOCTYPE html>'
      + '<html lang="en"><head><meta charset="utf-8" />'
      + '<title>' + meta.title + '</title>'
      + '<meta property="og:title" content="' + meta.title + '" />'
      + '<meta property="og:description" content="' + meta.description + '" />'
      + '<meta property="og:image" content="' + meta.image + '" />'
      + '<meta property="og:url" content="https://rulesnap.com' + path + '" />'
      + '<meta property="og:image:alt" content="Quick setup & play references for your favorite tabletop games" />'
      + '<meta property="og:type" content="website" />'
      + '</head><body></body></html>'
  };
}

function getMetaForPath(path) {
  const image = 'https://rulesnap.com/dice-512.png';
  // const image = 'https://images.ctfassets.net/8aevphvgewt8/4pe4eOtUJ0ARpZRE4fNekf/f52b1f9c52f059a33170229883731ed0/GH-Homepage-Universe-img.png';
  if (path.indexOf('/castles-of-burgundy') === 0)
    return {
      title: 'Castles of Burgundy Play Guide',
      description: 'A quick reference guide on how to play Castles of Burgundy',
      image: image,
    };
  if (path.indexOf('/quacks') === 0)
    return {
      title: 'Quacks of Quedlinburg Play Guide',
      description: 'A quick reference guide on how to play Quacks of Quedlinburg (or Quacks)',
      image: image,
    };
  return {
    title: 'Rule Snap',
    description: 'Quick setup & play references for your favorite tabletop games',
    image: image,
  };
}

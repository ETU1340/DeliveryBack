const generateHALLinks = (self, relatedLinks) => {
    const links = {
      self: { href: self, method: 'GET' }
    };
  
    for (const key in relatedLinks) {
      if (relatedLinks.hasOwnProperty(key)) {
        links[key] = relatedLinks[key];
      }
    }
  
    return { _links: links };
  };
  
  module.exports = generateHALLinks;
  
export const generateHALLinks = (self: string, relatedLinks: { [key: string]: { href: string, method: string } }) => {
    const links: { [key: string]: { href: string, method: string } } = {
      self: { href: self, method: 'GET' }
    };
  
    for (const key in relatedLinks) {
      links[key] = relatedLinks[key];
    }
  
    return links;
  };
  
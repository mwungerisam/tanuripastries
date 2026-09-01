/**
 * Utility to process, compress and convert uploaded image files to lightweight Data URLs
 * to ensure smooth performance and safe localStorage persistence.
 */

export const processImageFile = (file: File, maxWidth = 900, maxHeight = 900, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPEG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to process image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

export const BAKERY_IMAGE_PRESETS = [
  {
    name: 'Belgian Chocolate Ganache',
    url: '/src/assets/images/tanuri_cake_chocolate_1788298831775.jpg',
    category: 'celebration-cakes',
  },
  {
    name: 'Vanilla & Fresh Berry Velvet',
    url: '/src/assets/images/tanuri_vanilla_berry_1788298844963.jpg',
    category: 'celebration-cakes',
  },
  {
    name: 'Golden French Croissants',
    url: '/src/assets/images/tanuri_croissants_1788298858039.jpg',
    category: 'pastries-viennoiserie',
  },
  {
    name: 'Lotus Biscoff Caramel Cake',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
    category: 'celebration-cakes',
  },
  {
    name: 'Royal Red Velvet & Cream Cheese',
    url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=1000&auto=format&fit=crop',
    category: 'celebration-cakes',
  },
  {
    name: 'Passionfruit Mango Mousse Cake',
    url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop',
    category: 'celebration-cakes',
  },
  {
    name: 'Valrhona Pain au Chocolat',
    url: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop',
    category: 'pastries-viennoiserie',
  },
  {
    name: 'Pistachio Cruffins & Swirls',
    url: 'https://images.unsplash.com/photo-1621236378699-8597fab6a1c2?q=80&w=1000&auto=format&fit=crop',
    category: 'pastries-viennoiserie',
  },
  {
    name: 'Parisian French Macarons Box',
    url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=1000&auto=format&fit=crop',
    category: 'tarts-treats',
  },
  {
    name: 'Fresh Strawberry Tartlette',
    url: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    category: 'tarts-treats',
  },
  {
    name: 'Korean Bento Birthday Cake',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop',
    category: 'cupcakes-boxes',
  },
  {
    name: 'Gourmet Cupcake Assortment',
    url: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1000&auto=format&fit=crop',
    category: 'cupcakes-boxes',
  },
  {
    name: 'Beef Tenderloin & Onion Pastry',
    url: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=1000&auto=format&fit=crop',
    category: 'savory-bakes',
  },
  {
    name: 'Spinach & Feta Greek Puffs',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    category: 'savory-bakes',
  },
];

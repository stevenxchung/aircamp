import { prisma } from "../src/server/db";

const main = async () => {
  const mockCampgrounds = [
    {
      userId: "testUser123",
      name: "Cloud's Rest",
      price: "$666",
      description:
        "Mountain camp in Yosemite National Park east northeast of Yosemite Village, California. Although there are many peaks in the park having far greater elevation, Clouds Rest's proximity to the valley gives it a very high degree of visual prominence.",
      location: "Yosemite, California",
      lat: 37.8651,
      lng: -119.5383,
    },
    {
      userId: "testUser123",
      name: "Yellow Mountain",
      price: "$777",
      description:
        "Campsite near the mountain range in southern Anhui province in eastern China. Vegetation on the range is thickest below 1,100 meters (3,600 ft), with trees growing up to the treeline at 1,800 meters (5,900 ft).",
      location: "Huangshan City, Anhui",
      lat: 29.7152,
      lng: -118.3387,
    },
    {
      userId: "testUser123",
      name: "Shangri-La",
      price: "$888",
      description:
        "Mountain camp in mystical, harmonious valley, gently guided from a lamasery, enclosed in the western end of the Kunlun Mountains. Shangri-La has become synonymous with any earthly paradise, particularly a mythical Himalayan utopia - an enduringly happy land, isolated from the world. In the novel, the people who live in Shangri-La are almost immortal, living hundreds of years beyond the normal lifespan and only very slowly aging in appearance.",
      location: "Tibet, China",
      lat: 36.0,
      lng: 84.0,
    },
    {
      userId: "testUser123",
      name: "Nusa Penida",
      price: "$999",
      description:
        "Beach camp on an island located near the southeastern Indonesian island of Bali and a district of Klungkung Regency that includes the neighboring small island of Nusa Lembongan and twelve even smaller islands. The Badung Strait separates the island and Bali.",
      location: "Bali, Indonesia",
      lat: -8.7278,
      lng: 115.5444,
    },
  ];

  await prisma.airCampCampground.createMany({
    data: mockCampgrounds,
    skipDuplicates: true,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

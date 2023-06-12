import { prisma } from "../src/server/db";

const main = async () => {
  const mockCampgrounds = [
    {
      ownerId: "testUser123",
      name: "Cloud's Rest",
      price: "$666",
      image: "https://c1.staticflickr.com/6/5058/5535429179_aaa325d681_b.jpg",
      description:
        "Mountain camp in Yosemite National Park east northeast of Yosemite Village, California. Although there are many peaks in the park having far greater elevation, Clouds Rest's proximity to the valley gives it a very high degree of visual prominence.",
      location: "Yosemite, California",
      lat: 37.8651,
      lng: -119.5383,
    },
    {
      ownerId: "testUser123",
      name: "Yellow Mountain",
      price: "$777",
      image:
        "https://media.istockphoto.com/id/1170436003/photo/landscape-of-huangshan.jpg?s=612x612&w=0&k=20&c=7cFnrwTwlQq7BsFyf5yfAoDMSYPcNNJ31waRKesTWIs=",
      description:
        "Campsite near the mountain range in southern Anhui province in eastern China. Vegetation on the range is thickest below 1,100 meters (3,600 ft), with trees growing up to the treeline at 1,800 meters (5,900 ft).",
      location: "Huangshan City, Anhui",
      lat: 29.7152,
      lng: -118.3387,
    },
    {
      ownerId: "testUser123",
      name: "Shangri-La",
      price: "$888",
      image:
        "https://images.unsplash.com/photo-1568005508084-d289b79374f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Mountain camp in mystical, harmonious valley, gently guided from a lamasery, enclosed in the western end of the Kunlun Mountains. Shangri-La has become synonymous with any earthly paradise, particularly a mythical Himalayan utopia - an enduringly happy land, isolated from the world. In the novel, the people who live in Shangri-La are almost immortal, living hundreds of years beyond the normal lifespan and only very slowly aging in appearance.",
      location: "Tibet, China",
      lat: 36.0,
      lng: 84.0,
    },
    {
      ownerId: "testUser123",
      name: "Nusa Penida",
      price: "$999",
      image:
        "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
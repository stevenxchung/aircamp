var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://c1.staticflickr.com/6/5058/5535429179_aaa325d681_b.jpg",
        description: "Mountain camp in Yosemite National Park east northeast of Yosemite Village, California. Although there are many peaks in the park having far greater elevation, Clouds Rest's proximity to the valley gives it a very high degree of visual prominence."
    },    
    {
        name: "Sahara",
        image: "http://turplay.ru/wp-content/uploads/2018/01/sahara.jpg",
        description: "Site of the largest hot desert and the third largest desert in the world after Antarctica and the Arctic. Its area of 9,200,000 square kilometres (3,600,000 sq mi) is comparable to the area of China or the United States."
    },    
    {
        name: "Andaman",
        image: "https://i.ytimg.com/vi/mYunE9yaKbw/maxresdefault.jpg",
        description: "Camp close to a marginal sea of the eastern Indian Ocean separated from the Bay of Bengal (to its west) by the Andaman and Nicobar Islands and touching Myanmar (Burma), Thailand, and the Malay Peninsula. Its southernmost end is defined by Breueh Island, an island just north of Sumatra."
    },    
    {
        name: "Yellow Mountain",
        image: "https://www.chinadiscovery.com/assets/images/huangshan/yellow-mountain-breathtaking-scenery-200.jpg",
        description: "Campsite near the mountain range in southern Anhui province in eastern China. Vegetation on the range is thickest below 1,100 meters (3,600 ft), with trees growing up to the treeline at 1,800 meters (5,900 ft)."
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed campgrounds!");
         // Add a few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added a campground!");
                    // Create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet.",
                            author: "Steph"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment!");
                            }
                        });
                }
            });
        });
    });
}
module.exports = seedDB;
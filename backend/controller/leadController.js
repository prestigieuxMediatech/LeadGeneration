import puppeteer from "puppeteer";
import { LeadModels } from "../models/LeadModel.js";
import { UserModel } from "../models/UserModel.js";





export const GenerateLead = async (req, res) => {
  let browser;

  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const startTime = Date.now();

  try {
    const { business, place, Limit } = req.query;

    // Default: 40 businesses, maximum: 200
    const requestedLimit = Number.parseInt(Limit, 10);

    const limit = Math.min(
      Math.max(
        Number.isNaN(requestedLimit) ? 40 : requestedLimit,
        1
      ),
      200
    );

    if (
      typeof business !== "string" ||
      typeof place !== "string" ||
      !business.trim() ||
      !place.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Business and place are required.",
      });
    }

    console.log("Business:", business);
    console.log("Place:", place);
    console.log("Business limit:", limit);

    /*
    |--------------------------------------------------------------------------
    | 1. Launch optimized browser
    |--------------------------------------------------------------------------
    */

    browser = await puppeteer.launch({
      headless: true,

      defaultViewport: {
        width: 1080,
        height: 1024,
      },

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
      ],
    });

    // Optimize page loading
    const optimizePage = async (page) => {
      await page.setRequestInterception(true);

      page.on("request", (request) => {
        const blocked = ["image", "font", "media"];

        if (blocked.includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });

      page.setDefaultNavigationTimeout(80000);
      page.setDefaultTimeout(30000);
    };

    const page = await browser.newPage();

    await optimizePage(page);

    const query = `${business.trim()} in ${place.trim()}`;

    await page.goto(
      `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      }
    );

    console.log("Google Maps opened...");

    // Wait only until results are available
    await page.waitForSelector(
      '[role="feed"] a[href*="/maps/place/"]',
      {
        timeout: 15000,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | 2. Collect business links (optimized scrolling)
    |--------------------------------------------------------------------------
    */

    const restaurantMap = new Map();

    let unchangedCount = 0;

    console.log("Collecting business links...");

    while (
      restaurantMap.size < limit &&
      unchangedCount < 6
    ) {
      const restaurantLinks = await page.$$eval(
        '[role="feed"] a[href*="/maps/place/"]',
        (links) =>
          links.map((link) => ({
            name: link.getAttribute("aria-label"),
            url: link.href,
          }))
      );

      const previousCount = restaurantMap.size;

      for (const restaurant of restaurantLinks) {
        if (
          restaurant.url &&
          restaurant.url.includes("/maps/place/") &&
          !restaurantMap.has(restaurant.url)
        ) {
          restaurantMap.set(
            restaurant.url,
            restaurant
          );

          if (restaurantMap.size >= limit) {
            break;
          }
        }
      }

      console.log(
        `Collected ${restaurantMap.size}/${limit} businesses`
      );

      if (restaurantMap.size >= limit) {
        break;
      }

      // Check whether Google Maps reached the end
      const reachedEnd = await page.evaluate(() => {
        const feed = document.querySelector('[role="feed"]');

        if (!feed) return true;

        const text = feed.innerText.toLowerCase();

        return (
          text.includes("you've reached the end of the list") ||
          text.includes("you have reached the end of the list")
        );
      });

      if (reachedEnd) {
        console.log("Reached end of Google Maps results.");
        break;
      }

      // Scroll Google Maps results panel
      const scrolled = await page.evaluate(() => {
        const feed = document.querySelector('[role="feed"]');

        if (!feed) return false;

        feed.scrollBy({
          top: 1400,
          behavior: "instant",
        });

        return true;
      });

      if (!scrolled) {
        console.log("Google Maps results panel not found.");
        break;
      }

      // Wait for lazy loading
      await sleep(900);

      // Collect newly loaded links immediately after scrolling
      const newLinks = await page.$$eval(
        '[role="feed"] a[href*="/maps/place/"]',
        (links) =>
          links.map((link) => ({
            name: link.getAttribute("aria-label"),
            url: link.href,
          }))
      );

      for (const restaurant of newLinks) {
        if (
          restaurant.url &&
          restaurant.url.includes("/maps/place/") &&
          !restaurantMap.has(restaurant.url)
        ) {
          restaurantMap.set(
            restaurant.url,
            restaurant
          );

          if (restaurantMap.size >= limit) {
            break;
          }
        }
      }

      if (restaurantMap.size === previousCount) {
        unchangedCount++;

        console.log(
          `No new results (${unchangedCount}/6)`
        );
      } else {
        unchangedCount = 0;
      }
    }

    const uniqueRestaurants = [
      ...restaurantMap.values(),
    ].slice(0, limit);

    console.log(
      `Total businesses collected: ${uniqueRestaurants.length}`
    );

    // Close search page to free memory
    await page.close();

    /*
    |--------------------------------------------------------------------------
    | 3. Extract individual business details
    |--------------------------------------------------------------------------
    */

    const scrapeRestaurant = async (
      workerPage,
      restaurant
    ) => {
      await workerPage.goto(restaurant.url, {
        waitUntil: "domcontentloaded",
        timeout: 20000,
      });

      // Wait for the actual business heading
      await workerPage.waitForSelector("h1", {
        timeout: 8000,
      });

      // Wait for business information instead of fixed sleep
      await workerPage
        .waitForFunction(
          () => {
            return (
              document.querySelector(
                '[data-item-id="address"]'
              ) ||
              document.querySelector(
                '[data-item-id="authority"]'
              ) ||
              document.querySelector(
                '[data-item-id^="phone:tel:"]'
              )
            );
          },
          {
            timeout: 4000,
          }
        )
        .catch(() => {});

      const details = await workerPage.evaluate(() => {
        const getText = (selector) => {
          const element =
            document.querySelector(selector);

          return element?.innerText?.trim() || null;
        };

        const getLink = (selector) => {
          const element =
            document.querySelector(selector);

          return element?.href || null;
        };

        // Improved phone extraction
        const phoneElement = document.querySelector(
          '[data-item-id^="phone:tel:"]'
        );

        const phone =
          document
            .querySelector('a[href^="tel:"]')
            ?.getAttribute("href")
            ?.replace(/^tel:/i, "") ||
          phoneElement
            ?.getAttribute("data-item-id")
            ?.replace(/^phone:tel:/, "") ||
          null;

        const ratingElement = document.querySelector(
          '[role="img"][aria-label*="stars"]'
        );

        return {
          name: getText("h1"),

          phone,

          website: getLink(
            'a[data-item-id="authority"]'
          ),

          address: getText(
            '[data-item-id="address"]'
          ),

          rating:
            ratingElement?.getAttribute(
              "aria-label"
            ) || null,
        };
      });

      return {
        ...details,
        name: details.name || restaurant.name,
        mapsUrl: restaurant.url,
      };
    };

    /*
    |--------------------------------------------------------------------------
    | 4. Parallel scraping (3 workers)
    |--------------------------------------------------------------------------
    */

    const results = new Array(uniqueRestaurants.length);

    const CONCURRENCY = 3;

    let currentIndex = 0;
    let completed = 0;

    console.log("Starting parallel scraping...");

    const worker = async (workerId) => {
      const workerPage = await browser.newPage();

      await optimizePage(workerPage);

      try {
        while (true) {
          // Get next business index
          const index = currentIndex++;

          if (index >= uniqueRestaurants.length) {
            break;
          }

          const restaurant = uniqueRestaurants[index];

          console.log(
            `[Worker ${workerId}] Processing ${index + 1}/${uniqueRestaurants.length}`
          );

          try {
            const details = await scrapeRestaurant(
              workerPage,
              restaurant
            );

            results[index] = details;

            console.log(
              `[Worker ${workerId}] Success: ${details.name}`
            );
          } catch (error) {
            console.error(
              `[Worker ${workerId}] Failed: ${restaurant.name || restaurant.url}`,
              error.message
            );

            results[index] = {
              name: restaurant.name || null,
              phone: null,
              website: null,
              address: null,
              rating: null,
              mapsUrl: restaurant.url,
              error: error.message,
            };
          }

          completed++;

          console.log(
            `Progress: ${completed}/${uniqueRestaurants.length}`
          );
        }
      } finally {
        await workerPage.close().catch(() => {});
      }
    };

    // Start workers simultaneously
    const workerCount = Math.min(
      CONCURRENCY,
      uniqueRestaurants.length
    );

    const workers = Array.from(
      { length: workerCount },
      (_, index) => worker(index + 1)
    );

    await Promise.all(workers);

    /*
    |--------------------------------------------------------------------------
    | 5. Return final results
    |--------------------------------------------------------------------------
    */

    const executionTime = (
      (Date.now() - startTime) / 1000
    ).toFixed(2);

    console.log(
      `Finished. Processed ${results.length} businesses.`
    );

    console.log(
      `Total execution time: ${executionTime} seconds`
    );

    return res.status(200).json({
      success: true,
      requested: limit,
      total: results.length,
      leads: results,
    });

  } catch (error) {
    console.error(
      "GenerateLead error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate leads.",
      error: error.message,
    });

  } finally {
    if (browser) {
      await browser.close().catch((error) => {
        console.error(
          "Browser close error:",
          error.message
        );
      });
    }
  }
};



export const SaveLead = async (req, res) => {
  try {
    const { leads } = req.body;

   
    const user=await UserModel.findOne({_id:req.userId.id}).populate({
      path:"leads"
    })
    const allLeads=user.leads
    console.log("All Leads bolte")
    console.log(allLeads);
    const saveLeads = [];

    for (const e of leads) {

      // Check if lead already exists
      const exists = allLeads.some(
        (ele) => ele.name === e.name
      );

      // Skip duplicate
      if (exists) continue;

      // Save new lead
      const saved = await LeadModels.create({
        name: e.name,
        phone: e.phone ?? "",
        website: e.website ?? "",
        address: e.address ?? "",
        rating: e.rating ?? "",
        mapsUrl: e.mapsUrl ?? "",
        reminderUserId:req.userId.id
      });
      console.log("kuch bhi ")
      
     console.log(saved._id)
     user.leads.push(saved._id)
     await user.save()
      saveLeads.push(saved);

      // // Prevent duplicates within incoming leads too
      // allLeads.push(saved);
    }

    return res.json({
      success: true,
      saveLeads,
    });

  } catch (e) {
    console.log(e.message)
    return res.json({
      success: false,
      error: e.message,
    });
  }
};

// get lead

export const getLeads=async(req,res)=>{
  try{
    
    const user=await UserModel.findOne({_id:req.userId.id}).populate(
      {
      path:"leads",
      match:{intrested:true},}
    )

    // console.log(user.leads.reverse())

   const leads=await LeadModels.find()
   console.log(leads.reverse())
   
   res.json({success:true, "leads":user.leads.reverse()})
  }
  catch(e){
    console.log(e.message)
  }
}

// set Reminder
export const setReminder=async(req,res)=>{
  try{
    const{id, reminderDate}=req.body
      console.log(id, reminderDate)
    const leads=await LeadModels.findOneAndUpdate(
      
      {_id:id},
      {
        $set:{
          reminder:reminderDate,
          reminderSend:false
        }
      },
      {new:true}
    )

      console.log(leads)
   
    res.json({success:true,data:"reminder set successfully"})

  }
  catch(e){
    console.log(e.message)
    res.json({success:false, error:e.message})
  }
}

//set not intrested
export const notIntrested=async(req,res)=>{
  try{
    const {id}=req.body
      const leads=await LeadModels.findOneAndUpdate(
        {_id:id},
  {$set:{intrested:false }},
  {new:true}
)
 console.log(leads)
 res.json({success:true,data:"lead updated successfully"})

  }
  catch(e){
    console.log(e.message)
    res.json({success:false,error:e.message})
  }
}


//set as converted 
export const setConverted=async(req,res)=>{
  try{
    const {id}=req.body
     await LeadModels.findOneAndUpdate({_id:id},{$set:{converted:false}})

     res.json({success:true, data:"lead converted successfully "})
  }
   catch(e){
    console.log(e.message )
    res.json({success:false, error:e.message})
   }
}
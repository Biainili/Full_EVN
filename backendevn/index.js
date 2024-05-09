const express = require("express");
const puppeteer = require("puppeteer");

const PORT = process.env.PORT || 3002;

const app = express();

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});




// API for EaxchangeReat
app.get("/api", async (req, res) => {
  try {
    const data = await scrapeProduct(
      "https://www.rate.am/hy/armenian-dram-exchange-rates/exchange-points"
    );
    res.json({
      exchangeData: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API for Bank-Cash rate
app.get("/api/bankData", async (req, res) => {
  try {
    const bankData = await scraperProduct_Bank(
      "https://rate.am/am/armenian-dram-exchange-rates/banks/cash"
    );
    res.json({
      bankData: bankData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// API for Bank No-Cash rate
app.get("/api/bankDataNoCash", async (req, res) => {
  try {
    console.log("Start scraping...");
    const bankNoData = await scraperProduct_Bank_noCash(
      "https://rate.am/am/armenian-dram-exchange-rates/banks/non-cash"
    );
    console.log("Scraping completed successfully.");
    res.json({
      bankNoData: bankNoData,
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





// Bank-noCash reat START
async function scraperProduct_Bank_noCash(url) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(url);

  // Function for change staet in web page clike in No_CASH
  const toggleCheckbox = async (xpath) => {
    const [checkbox] = await page.$x(xpath);
    if (checkbox) {
      await checkbox.click();
    } else {
      console.error("Checkbox not found");
    }
  };

  // Пример использования: перед вызовом nocashExampel изменяем состояние чекбокса
  const checkboxXPath =
    "/html/body/div[2]/main/div[1]/div[2]/div[1]/div[1]/label[1]";
  await toggleCheckbox(checkboxXPath);

  const nocashExampel = async (selectors, sel_img) => {
    const [img] = await page.$x(sel_img);
    const result = {};

    result.name = "";
    result.dataUpDate = "";
    result.buyUSA = "";
    result.sellUSA = "";
    result.buyEUR = "";
    result.sellEUR = "";
    result.buyRUB = "";
    result.sellRUB = "";
    result.img = "";

    if (img) {
      const sel_Img = await img.getProperty("src");
      result.img = await sel_Img.jsonValue();
    }

    const values = await Promise.all(
      selectors.map(async (selector, index) => {
        const [element] = await page.$x(selector);
        if (element) {
          const sel_Property = await element.getProperty("textContent");
          return await sel_Property.jsonValue();
        } else {
          return "";
        }
      })
    );

    result.name = values[0];
    result.dataUpDate = values[1];
    result.buyUSA = values[2];
    result.sellUSA = values[3];
    result.buyEUR = values[4];
    result.sellEUR = values[5];
    result.buyRUB = values[6];
    result.sellRUB = values[7];

    return result;
  };
  // Data For NoCash

  // Data Bank 1
  const selectors_1 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[13]/div/div",
  ];

  const sel_img_1 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[1]/span/img";

  const bank_1 = await nocashExampel(selectors_1, sel_img_1);

  // Data Bank 2
  const selectors_2 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[13]/div/div",
  ];

  const sel_img_2 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[1]/span/img";

  const bank_2 = await nocashExampel(selectors_2, sel_img_2);

  // Data Bank 3
  const selectors_3 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[13]/div/div",
  ];

  const sel_img_3 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[1]/span/img";

  const bank_3 = await nocashExampel(selectors_3, sel_img_3);

  // Data Bank 4
  const selectors_4 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[13]/div/div",
  ];

  const sel_img_4 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[1]/span/img";

  const bank_4 = await nocashExampel(selectors_4, sel_img_4);

  // Data Bank 5
  const selectors_5 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[13]/div/div",
  ];

  const sel_img_5 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[1]/span/img";

  const bank_5 = await nocashExampel(selectors_5, sel_img_5);

  // Data Bank 6
  const selectors_6 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[13]/div/div",
  ];

  const sel_img_6 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[1]/span/img";

  const bank_6 = await nocashExampel(selectors_6, sel_img_6);

  // Data Bank 7
  const selectors_7 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[13]/div/div",
  ];

  const sel_img_7 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[1]/span/img";

  const bank_7 = await nocashExampel(selectors_7, sel_img_7);

  // Data Bank 8
  const selectors_8 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[13]/div/div",
  ];

  const sel_img_8 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[1]/span/img";

  const bank_8 = await nocashExampel(selectors_8, sel_img_8);

  // Data Bank 9
  const selectors_9 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[13]/div/div",
  ];
  const sel_img_9 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[1]/span/img";

  const bank_9 = await nocashExampel(selectors_9, sel_img_9);

  // Data Bank 10
  const selectors_10 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[13]/div/div",
  ];
  const sel_img_10 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[1]/span/img";

  const bank_10 = await nocashExampel(selectors_10, sel_img_10);

  // Data Bank 11
  const selectors_11 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[13]/div/div",
  ];

  const sel_img_11 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[1]/span/img";

  const bank_11 = await nocashExampel(selectors_11, sel_img_11);

  // Data Bank 12
  const selectors_12 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[13]/div/div",
  ];

  const sel_img_12 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[1]/span/img";

  const bank_12 = await nocashExampel(selectors_12, sel_img_12);

  // Data Bank 13
  const selectors_13 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[13]/div/div",
  ];

  const sel_img_13 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[1]/span/img";

  const bank_13 = await nocashExampel(selectors_13, sel_img_13);

  //Data Bank 14
  const selectors_14 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[13]/div/div",
  ];

  const sel_img_14 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[1]/span/img";

  const bank_14 = await nocashExampel(selectors_14, sel_img_14);

  // Data Bank 15
  const selectors_15 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[13]/div/div",
  ];
  const sel_img_15 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[1]/span/img";

  const bank_15 = await nocashExampel(selectors_15, sel_img_15);

  // Data Bank 16
  const selectors_16 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[13]/div/div",
  ];

  const sel_img_16 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[1]/span/img";

  const bank_16 = await nocashExampel(selectors_16, sel_img_16);

  // Data Bank 17
  const selectors_17 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[13]/div/div",
  ];

  const sel_img_17 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[1]/span/img";

  const bank_17 = await nocashExampel(selectors_17, sel_img_17);

  // Data Bank 18
  const selectors_18 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[13]/div/div",
  ];

  const sel_img_18 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[1]/span/img";

  const bank_18 = await nocashExampel(selectors_18, sel_img_18);

  const ExchangeMarketBankCashNo = [
    bank_1,
    bank_2,
    bank_3,
    bank_4,
    bank_5,
    bank_6,
    bank_7,
    bank_8,
    bank_9,
    bank_10,
    bank_11,
    bank_12,
    bank_13,
    bank_14,
    bank_15,
    bank_16,
    bank_17,
    bank_18,
  ];

  await browser.close();

  // console.log(ExchangeMarketBankCashNo);

  return ExchangeMarketBankCashNo;
}

// Bank-Cash reat
async function scraperProduct_Bank(url) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(url);

  const bankRateData = async (selectors, sel_img) => {
    const [img] = await page.$x(sel_img);
    const result = {};

    result.name = "";
    result.dataUpDate = "";
    result.buyUSA = "";
    result.sellUSA = "";
    result.buyEUR = "";
    result.sellEUR = "";
    result.buyRUB = "";
    result.sellRUB = "";
    result.img = "";

    if (img) {
      const sel_Img = await img.getProperty("src");
      result.img = await sel_Img.jsonValue();
    }

    const values = await Promise.all(
      selectors.map(async (selector, index) => {
        const [element] = await page.$x(selector);
        if (element) {
          const sel_Property = await element.getProperty("textContent");
          return await sel_Property.jsonValue();
        } else {
          return "";
        }
      })
    );

    // Устанавливаем значения в объект result используя предопределенные ключи
    result.name = values[0];
    result.dataUpDate = values[1];
    result.buyUSA = values[2];
    result.sellUSA = values[3];
    result.buyEUR = values[4];
    result.sellEUR = values[5];
    result.buyRUB = values[6];
    result.sellRUB = values[7];

    return result;
  };

  // Dtat bank Cash

  // Dtat bank_1

  const selectors_1 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[13]/div/div",
  ];

  const sel_img_1 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[1]/span/img";

  const bank_1 = await bankRateData(selectors_1, sel_img_1);

  // Data Bank 2
  const selectors_2 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[13]/div/div",
  ];

  const sel_img_2 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[1]/span/img";

  const bank_2 = await bankRateData(selectors_2, sel_img_2);

  // Data Bank 3
  const selectors_3 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[13]/div/div",
  ];

  const sel_img_3 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[1]/span/img";

  const bank_3 = await bankRateData(selectors_3, sel_img_3);

  // Data Bank 4
  const selectors_4 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[13]/div/div",
  ];

  const sel_img_4 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[1]/span/img";

  const bank_4 = await bankRateData(selectors_4, sel_img_4);

  // Data Bank 5
  const selectors_5 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[13]/div/div",
  ];

  const sel_img_5 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[1]/span/img";

  const bank_5 = await bankRateData(selectors_5, sel_img_5);

  // Data Bank 6
  const selectors_6 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[13]/div/div",
  ];

  const sel_img_6 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[1]/span/img";

  const bank_6 = await bankRateData(selectors_6, sel_img_6);

  // Data Bank 7
  const selectors_7 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[13]/div/div",
  ];

  const sel_img_7 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[1]/span/img";

  const bank_7 = await bankRateData(selectors_7, sel_img_7);

  // Data Bank 8
  const selectors_8 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[13]/div/div",
  ];

  const sel_img_8 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[1]/span/img";

  const bank_8 = await bankRateData(selectors_8, sel_img_8);

  // Data Bank 9
  const selectors_9 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[13]/div/div",
  ];
  const sel_img_9 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[1]/span/img";

  const bank_9 = await bankRateData(selectors_9, sel_img_9);

  // Data Bank 10
  const selectors_10 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[13]/div/div",
  ];
  const sel_img_10 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[1]/span/img";

  const bank_10 = await bankRateData(selectors_10, sel_img_10);

  // Data Bank 11
  const selectors_11 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[13]/div/div",
  ];

  const sel_img_11 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[1]/span/img";

  const bank_11 = await bankRateData(selectors_11, sel_img_11);

  // Data Bank 12
  const selectors_12 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[13]/div/div",
  ];

  const sel_img_12 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[1]/span/img";

  const bank_12 = await bankRateData(selectors_12, sel_img_12);

  // Data Bank 13
  const selectors_13 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[13]/div/div",
  ];

  const sel_img_13 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[1]/span/img";

  const bank_13 = await bankRateData(selectors_13, sel_img_13);

  //Data Bank 14
  const selectors_14 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[13]/div/div",
  ];

  const sel_img_14 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[1]/span/img";

  const bank_14 = await bankRateData(selectors_14, sel_img_14);

  // Data Bank 15
  const selectors_15 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[13]/div/div",
  ];
  const sel_img_15 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[1]/span/img";

  const bank_15 = await bankRateData(selectors_15, sel_img_15);

  // Data Bank 16
  const selectors_16 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[13]/div/div",
  ];

  const sel_img_16 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[1]/span/img";

  const bank_16 = await bankRateData(selectors_16, sel_img_16);

  // Data Bank 17
  const selectors_17 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[13]/div/div",
  ];

  const sel_img_17 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[1]/span/img";

  const bank_17 = await bankRateData(selectors_17, sel_img_17);

  // Data Bank 18
  const selectors_18 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[4]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[7]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[10]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[12]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[13]/div/div",
  ];

  const sel_img_18 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[1]/span/img";

  const bank_18 = await bankRateData(selectors_18, sel_img_18);

  const ExchangeMarketBankCash = [
    bank_1,
    bank_2,
    bank_3,
    bank_4,
    bank_5,
    bank_6,
    bank_7,
    bank_8,
    bank_9,
    bank_10,
    bank_11,
    bank_12,
    bank_13,
    bank_14,
    bank_15,
    bank_16,
    bank_17,
    bank_18,
  ];

  await browser.close();

  // console.log("Cash", ExchangeMarketBankCash);

  return ExchangeMarketBankCash;
}

// Exchange rate
async function scrapeProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const extractData = async (selectors, sel_img) => {
    const [img] = await page.$x(sel_img);
    const result = {};

    result.name = "";
    result.dataUpDate = "";
    result.buyUSA = "";
    result.sellUSA = "";
    result.buyEUR = "";
    result.sellEUR = "";
    result.buyRUB = "";
    result.sellRUB = "";
    result.img = "";

    if (img) {
      const sel_Img = await img.getProperty("src");
      result.img = await sel_Img.jsonValue();
    }

    const values = await Promise.all(
      selectors.map(async (selector, index) => {
        const [element] = await page.$x(selector);
        if (element) {
          const sel_Property = await element.getProperty("textContent");
          return await sel_Property.jsonValue();
        } else {
          return "";
        }
      })
    );

    // Устанавливаем значения в объект result используя предопределенные ключи
    result.name = values[0];
    result.dataUpDate = values[1];
    result.buyUSA = values[2];
    result.sellUSA = values[3];
    result.buyEUR = values[4];
    result.sellEUR = values[5];
    result.buyRUB = values[6];
    result.sellRUB = values[7];

    return result;
  };

  // ExChange Place_1
  const selectors_1 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[3]",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[6]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[9]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[12]/div/div",
  ];

  const sel_img_1 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[1]/td[1]/span/img";

  const exPlace_1 = await extractData(selectors_1, sel_img_1);


  // ExChange Place_2
  const selectors_2 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[3]",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[6]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[9]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[12]/div/div",
  ];

  const sel_img_2 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[2]/td[1]/span/img";

  const exPlace_2 = await extractData(selectors_2, sel_img_2);


  // ExChange Place_3
  const selectors_3 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[3]",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[6]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[9]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[12]/div/div",
  ];

  const sel_img_3 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[3]/td[1]/span/img";

  const exPlace_3 = await extractData(selectors_3, sel_img_3);


  // ExChange Place_4
  const selectors_4 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[3]",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[6]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[9]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[12]/div/div",
  ];

  const sel_img_4 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[4]/td[1]/span/img";

  const exPlace_4 = await extractData(selectors_4, sel_img_4);



  // ExChange Place_5
  const selectors_5 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[3]",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[6]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[9]/div/div",

    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[12]/div/div",
  ];

  const sel_img_5 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[5]/td[1]/span/img";

  const exPlace_5 = await extractData(selectors_5, sel_img_5);

  // ExChange Place_6
  const selectors_6 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[12]/div/div",
  ]
  const sel_img_6 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[6]/td[1]/span/img";

  const exPlace_6 = await extractData(selectors_6, sel_img_6);


  // ExChange Place_7
  const selectors_7 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[12]/div/div",
  ]
  const sel_img_7 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[7]/td[1]/span/img";

  const exPlace_7 = await extractData(selectors_7, sel_img_7);


  // ExChange Place_8
  const selectors_8 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[12]/div/div",
  ]
  const sel_img_8 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[8]/td[1]/span/img";

  const exPlace_8 = await extractData(selectors_8, sel_img_8);


  // ExChange Place_9
  const selectors_9 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[12]/div/div",
  ]
  const sel_img_9 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[9]/td[1]/span/img";

  const exPlace_9 = await extractData(selectors_9, sel_img_9);



  // ExChange Place_10
  const selectors_10 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[12]/div/div",
  ]
  const sel_img_10 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[10]/td[1]/span/img";

  const exPlace_10 = await extractData(selectors_10, sel_img_10);


  // ExChange Place_11
  const selectors_11 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[12]/div/div",
  ]
  const sel_img_11 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[11]/td[1]/span/img";

  const exPlace_11 = await extractData(selectors_11, sel_img_11);


  // ExChange Place_12
  const selectors_12 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[12]/div/div",
  ]
  const sel_img_12 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[12]/td[1]/span/img";

  const exPlace_12 = await extractData(selectors_12, sel_img_12);


  // ExChange Place_13
  const selectors_13 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[12]/div/div",
  ]
  const sel_img_13 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[13]/td[1]/span/img";

  const exPlace_13 = await extractData(selectors_13, sel_img_13);


  // ExChange Place_14
  const selectors_14 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[12]/div/div",
  ]
  const sel_img_14 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[14]/td[1]/span/img";

  const exPlace_14 = await extractData(selectors_14, sel_img_14);



  // ExChange Place_15
  const selectors_15 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[12]/div/div",
  ]
  const sel_img_15 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[15]/td[1]/span/img";

  const exPlace_15 = await extractData(selectors_15, sel_img_15);


  // ExChange Place_16
  const selectors_16 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[12]/div/div",
  ]
  const sel_img_16 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[16]/td[1]/span/img";

  const exPlace_16 = await extractData(selectors_16, sel_img_16);


  // ExChange Place_17
  const selectors_17 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[12]/div/div",
  ]
  const sel_img_17 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[17]/td[1]/span/img";

  const exPlace_17 = await extractData(selectors_17, sel_img_17);


  // ExChange Place_18
  const selectors_18 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[12]/div/div",
  ]
  const sel_img_18 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[18]/td[1]/span/img";

  const exPlace_18 = await extractData(selectors_18, sel_img_18);


  // ExChange Place_19
  const selectors_19 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[12]/div/div",
  ]
  const sel_img_19 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[19]/td[1]/span/img";

  const exPlace_19 = await extractData(selectors_19, sel_img_19);




  // ExChange Place_20
  const selectors_20 = [
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[1]/span/a",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[3]",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[5]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[6]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[8]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[9]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[11]/div/div",
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[12]/div/div",
  ]
  const sel_img_20 =
    "/html/body/div[2]/main/div[1]/div[2]/div[3]/table/tbody/tr[20]/td[1]/span/img";

  const exPlace_20 = await extractData(selectors_20, sel_img_20);



  const ExchangeMarketManr = [
    exPlace_1,
    exPlace_2,
    exPlace_3,
    exPlace_4,
    exPlace_5,
    exPlace_6,
    exPlace_7,
    exPlace_8,
    exPlace_9,
    exPlace_10,
    exPlace_11,
    exPlace_12,
    exPlace_13,
    exPlace_14,
    exPlace_15,
    exPlace_16,
    exPlace_17,
    exPlace_18,
    exPlace_20
  ];

  await browser.close();

  // console.log("This Exchange", ExchangeMarketManr);

  return ExchangeMarketManr;
}



// Functions Call
scrapeProduct(
  "https://www.rate.am/hy/armenian-dram-exchange-rates/exchange-points"
);

scraperProduct_Bank(
  "https://rate.am/am/armenian-dram-exchange-rates/banks/cash"
);

scraperProduct_Bank_noCash(
  "https://rate.am/am/armenian-dram-exchange-rates/banks/non-cash"
);

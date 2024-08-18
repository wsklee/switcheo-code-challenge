"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface Price {
  currency: string;
  date: string;
  price: number;
}

interface SwapformProps {
  prices: Price[];
}

const Swapform: React.FC<SwapformProps> = ({ prices }) => {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellError, setSellError] = useState("");
  const [buyError, setBuyError] = useState("");
  const [sellCurrency, setSellCurrency] = useState("ETH");
  const [buyCurrency, setBuyCurrency] = useState("LUNA");
  const [isSellAmountChanged, setIsSellAmountChanged] = useState(false);
  const [isBuyAmountChanged, setIsBuyAmountChanged] = useState(false);
  const [svgIcons, setSvgIcons] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isBuyAmountChanged) {
      calculateBuyAmount(sellAmount, sellCurrency, buyCurrency);
    }
    setIsBuyAmountChanged(false);
  }, [sellAmount, sellCurrency, buyCurrency]);

  useEffect(() => {
    const fetchSvgIcons = async () => {
      const icons = {};
      for (const price of prices) {
        const response = await fetch(
          `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${price.currency}.svg`
        );
        const svg = await response.text();
        icons[price.currency] = svg;
      }
      setSvgIcons(icons);
    };

    fetchSvgIcons();
  }, [prices]);

  const handleSellChange = (e) => {
    const value = e.target.value;
    if (isNaN(value)) {
      setSellError("Invalid amount");
    } else {
      setSellError("");
      setSellAmount(value);
      setIsSellAmountChanged(true);
    }
  };

  const handleBuyChange = (e) => {
    const value = e.target.value;
    if (isNaN(value)) {
      setBuyError("Invalid amount");
    } else {
      setBuyError("");
      setBuyAmount(value);
      setIsBuyAmountChanged(true);
      calculateSellAmount(value, sellCurrency, buyCurrency);
    }
  };

  const calculateBuyAmount = (
    sellAmount: number,
    sellCurrency: string,
    buyCurrency: string
  ) => {
    const sellPrice = prices.find(
      (price) => price.currency === sellCurrency
    )?.price;
    const buyPrice = prices.find(
      (price) => price.currency === buyCurrency
    )?.price;
    if (sellPrice && buyPrice) {
      const amount = (sellAmount * sellPrice) / buyPrice;
      setBuyAmount(amount.toFixed(2));
    }
  };

  const calculateSellAmount = (
    buyAmount: number,
    sellCurrency: string,
    buyCurrency: string
  ) => {
    const sellPrice = prices.find(
      (price) => price.currency === sellCurrency
    )?.price;
    const buyPrice = prices.find(
      (price) => price.currency === buyCurrency
    )?.price;
    if (sellPrice && buyPrice) {
      const amount = (buyAmount * buyPrice) / sellPrice;
      setSellAmount(amount.toFixed(2));
    }
  };

  const getTotalPrice = (amount: number, currency: string) => {
    const price = prices.find((price) => price.currency === currency)?.price;
    return price ? (amount * price).toFixed(2) : "0.00";
  };

  const handleSubmit = () => {
    if (!sellAmount || !buyAmount) {
      if (!sellAmount) setSellError("Sell amount is required");
      if (!buyAmount) setBuyError("Buy amount is required");
      return;
    }
    alert(
      `Swapping ${sellAmount} ${sellCurrency.toUpperCase()} for ${buyAmount} ${buyCurrency.toUpperCase()}`
    );
  };

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto rounded-lg">
      <div className="flex justify-center mb-4">
        <button className="px-4 py-2 rounded-full">Swap Form</button>
      </div>
      <div className="p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm">Sell</label>
            <input
              type="text"
              value={sellAmount}
              onChange={handleSellChange}
              className="w-full bg-transparent text-3xl outline-none"
              placeholder="0.0"
            />
            {sellError && <p className="text-sm">{sellError}</p>}
            <p className="text-gray-500">
              ${getTotalPrice(sellAmount, sellCurrency)}
            </p>
          </div>
          <Select onValueChange={setSellCurrency}>
            <SelectTrigger className="flex items-center rounded-full px-2 py-1">
              <SelectValue placeholder={sellCurrency} />
            </SelectTrigger>
            <SelectContent>
              {prices.map((price) => (
                <SelectItem key={price.currency} value={price.currency}>
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 mr-6"
                      dangerouslySetInnerHTML={{
                        __html: svgIcons[price.currency],
                      }}
                    />
                    {price.currency.toUpperCase()}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center">
          <img
            src="/ArrowDownIcon.svg"
            alt="Arrow Down"
            className="w-6 h-6 p-1 rounded-full cursor-pointer"
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm">Buy</label>
            <input
              type="text"
              value={buyAmount}
              onChange={handleBuyChange}
              className="w-full bg-transparent text-3xl outline-none"
              placeholder="0.0"
            />
            {buyError && <p className="text-red-500 text-sm">{buyError}</p>}
            <p className="text-gray-500">
              ${getTotalPrice(buyAmount, buyCurrency)}
            </p>
          </div>
          <Select onValueChange={setBuyCurrency}>
            <SelectTrigger className="flex items-center rounded-full px-2 py-1">
              <SelectValue placeholder={buyCurrency} />
            </SelectTrigger>
            <SelectContent>
              {prices.map((price) => (
                <SelectItem key={price.currency} value={price.currency}>
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 mr-6"
                      dangerouslySetInnerHTML={{
                        __html: svgIcons[price.currency],
                      }}
                    />
                    {price.currency.toUpperCase()}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 text-center rounded-full"
        >
          Swap!
        </button>
      </div>
    </div>
  );
};

export default Swapform;

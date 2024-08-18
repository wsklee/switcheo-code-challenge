import Swapform from "@/components/component/Swapform";
import { Price } from "@/components/component/Swapform";

export default async function Home() {
  const res = await fetch("https://interview.switcheo.com/prices.json");
  const data = await res.json();

  // Filter out duplicate currencies
  const seenCurrencies = new Set();
  const prices = data.filter((item: Price) => {
    if (seenCurrencies.has(item.currency)) {
      return false;
    } else {
      seenCurrencies.add(item.currency);
      return true;
    }
  });

  return <Swapform prices={prices} />;
}

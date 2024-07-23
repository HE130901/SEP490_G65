// src/app/payment/vnpay_return/page.tsx
import dynamic from "next/dynamic";

const VnpayReturn = dynamic(() => import("@/components/vnpay_return"), {
  ssr: false, // Disable server-side rendering for this component
});

const Page = () => <VnpayReturn />;

export default Page;

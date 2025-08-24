export default function PricingPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Pricing</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-2xl p-4">
          <div className="font-medium">Free</div>
          <div className="text-sm text-slate-600">Watermark, basic templates</div>
          <div className="mt-3 text-2xl font-bold">$0</div>
        </div>
        <div className="border rounded-2xl p-4">
          <div className="font-medium">Pro</div>
          <div className="text-sm text-slate-600">No watermark, premium templates</div>
          <div className="mt-3 text-2xl font-bold">$5/month</div>
        </div>
      </div>
    </div>
  );
}

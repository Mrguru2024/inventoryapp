import { VinDecoder } from "@/app/components/VinDecoder";

export default function VinDecoderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">VIN Decoder</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Enter a vehicle's VIN (Vehicle Identification Number) to decode and
            view its information. The model year is optional but recommended for
            more accurate results.
          </p>
          <VinDecoder />
        </div>
      </div>
    </div>
  );
}

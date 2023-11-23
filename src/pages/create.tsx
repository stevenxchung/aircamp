import { GoogleMap, MarkerF } from "@react-google-maps/api";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { GeocodeResult } from "use-places-autocomplete";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { LoadingPage } from "~/components/loading";
import { api } from "~/utils/api";

const SearchBarComponent = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          className="px-2 py-2 hover:bg-gray-200"
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-600">
        Search
      </label>
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder="Washington Monument"
        className="mt-1 w-full rounded-md border p-2"
        required
      />

      {status === "OK" && (
        <ul className="mt-1 list-none rounded-md border bg-white pl-0">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};

const MapComponent = (props: {
  onLocationSelect: (location: string, lat: number, lng: number) => void;
}) => {
  // Reference: https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps
  const [lat, setLat] = useState(38.8895);
  const [lng, setLng] = useState(-77.0353);
  const mapCenter = useMemo(() => ({ lat, lng }), [lat, lng]);
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  return (
    <div className="mb-4">
      <SearchBarComponent
        onAddressSelect={(address) => {
          void getGeocode({ address: address }).then((results) => {
            const { lat, lng } = getLatLng(results[0] as GeocodeResult);
            console.log(lat, lng);
            setLat(lat);
            setLng(lng);
            props.onLocationSelect(address, lat, lng);
          });
        }}
      />
      <GoogleMap
        options={mapOptions}
        center={mapCenter}
        mapContainerStyle={{ height: "400px" }}
        zoom={14}
      >
        <MarkerF position={mapCenter} />
      </GoogleMap>
    </div>
  );
};

const FormInputElement = (props: {
  label: string;
  formId: string;
  value: string | number;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  rows?: number;
  error?: string | null;
}) => (
  <div className="mb-4">
    <label
      htmlFor={props.formId}
      className="block text-sm font-medium text-gray-600"
    >
      {props.formId === "imageSource" ? (
        <Link href="https://unsplash.com/" passHref target="_blank">
          {props.label}
        </Link>
      ) : (
        props.label
      )}
    </label>
    {props.rows ? (
      <textarea
        id={props.formId}
        name={props.formId}
        value={props.value}
        onChange={props.handleChange}
        rows={props.rows}
        className="mt-1 w-full rounded-md border p-2"
        placeholder={props.placeholder}
        required
      />
    ) : (
      <input
        type={typeof props.value == "string" ? "text" : "number"}
        id={props.formId}
        name={props.formId}
        value={props.value}
        onChange={props.handleChange}
        className="mt-1 w-full rounded-md border p-2"
        placeholder={props.placeholder}
        required
      />
    )}
    {props.error && (
      <div className="mt-2 font-bold" style={{ color: "red" }}>
        {props.error}
      </div>
    )}
  </div>
);

const CreateCampground: NextPage = () => {
  const defaultState = {
    name: "",
    price: 0.99,
    summary: "",
    description: "",
    imageSource: "",
    location: "",
    lat: 0,
    lng: 0,
  };
  const router = useRouter();
  const [formData, setFormData] = useState(defaultState);
  const [imageError, setImageError] = useState<string | null>(null);

  const { mutate, isLoading: creating } = api.campgrounds.create.useMutation({
    onSuccess: () => {
      // Reset form on success
      setFormData(defaultState);

      // Navigate back to the campgrounds page
      void router.push("/campgrounds");
    },
    onError: (e) => {
      switch (true) {
        case e.message.toLowerCase().includes("unique constraint failed"):
          toast.error("Campground name already exists!");
          break;
        case e.message.toLowerCase() === "unauthorized":
          toast.error("Please login or register to create a campground.");
          break;
        default:
          toast.error("Failed to create campground! Please try again later.");
          break;
      }
    },
  });

  const isImageUrl = (url: string): boolean => {
    // Regular expression to check if the URL ends with a common image file extension
    const regex = /(unsplash)/;
    return url.match(regex) !== null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Reset image error when input changes
    setImageError(null);
  };

  const handleLocationSelect = (location: string, lat: number, lng: number) => {
    // Update state when location changes
    setFormData((prevData) => ({ ...prevData, location, lat, lng }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isImageUrl(formData.imageSource)) {
      setImageError("Invalid image URL. Please enter a valid image link.");
    } else {
      // No error, attempt to create the campground
      mutate({ ...formData, price: formData.price.toString() });
    }
  };

  return (
    <>
      <Head>
        <title>Create Campground</title>
      </Head>
      <main>
        {creating ? (
          <LoadingPage />
        ) : (
          <div className="mx-auto my-4 mt-8 max-w-xl rounded-md bg-gray-100 p-6 shadow-md">
            <h2 className="mb-4 text-center text-2xl font-semibold">
              Create Campground
            </h2>
            <form onSubmit={handleSubmit}>
              <FormInputElement
                label="Name"
                formId="name"
                value={formData.name}
                handleChange={handleChange}
              />
              <FormInputElement
                label="Image Source"
                formId="imageSource"
                value={formData.imageSource}
                handleChange={handleChange}
                error={imageError}
                placeholder="https://images.unsplash.com/..."
              />
              <FormInputElement
                label="Price (USD)"
                formId="price"
                value={formData.price}
                handleChange={handleChange}
              />
              <FormInputElement
                label="Summary"
                formId="summary"
                value={formData.summary}
                handleChange={handleChange}
                rows={2}
                placeholder="The Washington Monument is an obelisk on the National Mall..."
              />
              <FormInputElement
                label="Description"
                formId="description"
                value={formData.description}
                handleChange={handleChange}
                rows={4}
                placeholder="The tallest monumental column in the world if all are measured above their pedestrian entrances. It was the world's tallest structure between 1884 and 1889, after which it was overtaken by the Eiffel Tower, in Paris..."
              />
              <MapComponent onLocationSelect={handleLocationSelect} />
              <div className="px-4">
                <button
                  type="submit"
                  className="w-full rounded-md border bg-blue-500 p-2 text-xl text-white hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default CreateCampground;

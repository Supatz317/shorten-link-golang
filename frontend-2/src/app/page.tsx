"use client";

import { useState } from "react";
import React from "react";
import axios from "axios";

interface PageProps {
  shortUrl: string;
  setShortUrl: (value: string) => void;
  quickShare: string;
  setQuickShare: (value: string) => void;
}

function Page1(pageProps: PageProps) {
  const {setShortUrl } = pageProps;
  const {setQuickShare} = pageProps;

  const [url, setUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shorten`, {
        url,
      });
      const { short_url, quickshare } = response.data;
      setShortUrl(short_url);
      setQuickShare(quickshare + "\n" + process.env.NEXT_PUBLIC_APP_URL + "/" + short_url);
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  return (
    <div className="w-svh container mx-auto p-8  bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="space-y-4">
        <h5 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          URL Shortener
        </h5>
        <p className="mb-2 font-normal text-gray-500 dark:text-gray-400">
          Enter the URL
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="url"
              id="url"
              className="block w-full p-4  text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Shorten
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Result(pageProps: PageProps) {
  const { shortUrl, quickShare} = pageProps;
  const [title, setTitle] = useState("Your short link");

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/${shortUrl}`);
    setTitle("Copied!");
  };

  return (
    <div className="w-svh container mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-row ">
        
        {/* link */}
        <div className="space-y-4 basis-1/2 px-2 ">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>

          <div className="w-full ">
            <div className="relative">
              <label className="sr-only">Label</label>
              <input
                id="npm-install-copy-button"
                type="text"
                className=" bg-gray-50 border border-gray-300 text-gray-500 text-md text-start pe-16  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={`${process.env.NEXT_PUBLIC_APP_URL}/${shortUrl}`}
                disabled
              />

              <button
                onClick={handleCopyToClipboard}
                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
              >
                <span id="default-icon">
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* quick share */}
        <div className="space-y-4 basis-1/2 px-2">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quick share
          </h5>

          <div className="w-full max-w-auto">
            <div className="relative">
              <label className="sr-only">Label</label>
              <textarea
                className=" bg-gray-50 border border-gray-300 text-gray-500 text-md text-start pe-16  rounded-lg resize-y focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={`${quickShare}`}
                disabled
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(quickShare);
                }}
                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
              >
                <span id="default-icon">
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
              </button>

              <div
                id="tooltip-copy-npm-install-copy-button"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
              >
                <span id="default-tooltip-message">Copy to clipboard</span>
                <span id="success-tooltip-message" className="hidden">
                  Copied!
                </span>
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [shortUrl, setShortUrl] = useState("");
  const [quickShare, setQuickShare] = useState("");

  return (
    <>
      {!shortUrl ? (
        <Page1 shortUrl={shortUrl} setShortUrl={setShortUrl} quickShare={quickShare} setQuickShare={setQuickShare} />
      ) : (
        <Result shortUrl={shortUrl} setShortUrl={setShortUrl} quickShare={quickShare} setQuickShare={setQuickShare}/>
      )}
    </>
  );
}

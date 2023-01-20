/* eslint-disable jsx-a11y/media-has-caption */

import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import Image from "next/image";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import _ from "lodash";
import React from "react";

// https://www.contentful.com/blog/2021/04/14/rendering-linked-assets-entries-in-contentful/
// https://github.com/whitep4nth3r/contentful-graphql-vs-rest/blob/main/pages/graphql.js

/**
 * https://www.contentful.com/blog/2021/04/14/rendering-linked-assets-entries-in-contentful/
 * https://github.com/whitep4nth3r/contentful-graphql-vs-rest/blob/main/pages/graphql.js
 *
 * Function to render Rich Text from contentful
 * @param {object} links - Links passed from contetnful
 */

export default function renderOptions(links) {
  const videoContentTypes = ["video/mp4", "video/webm", "video/quicktime"];
  const imageContentTypes = ["image/jpeg", "image/png", "image/gif"];

  // create an asset map
  const assetMap = new Map();
  const entryMapBlock = new Map();
  const entryMapInline = new Map();
  // loop through the assets and add them to the map
  if (links?.assets?.block) {
    for (const asset of links.assets.block) {
      assetMap.set(asset.sys.id, asset);
    }
  }
  if (links?.entries?.block) {
    for (const asset of links.entries.block) {
      entryMapBlock.set(asset.sys.id, asset);
    }
  }
  if (links?.entries?.inline) {
    for (const asset of links.entries.inline) {
      entryMapInline.set(asset.sys.id, asset);
    }
  }

  const makeDomains = "wwww.make.com";

  return {
    renderNode: {
      // render block assets, media like image or video
      [INLINES.HYPERLINK]: (link) => {
        if (!link.data.uri) {
          return;
        }
        let url;
        try {
          url = new URL(link.data.uri);
        } catch (e) {
          return;
        }

        const aParams = {};
        if (!makeDomains.includes(url.hostname)) {
          aParams.rel = `nofollow`;
        }

        return (
          <a href={link.data?.uri} {...aParams}>
            {link?.content[0]?.value || link.data.uri}
          </a>
        );
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        // find the asset in the assetMap by ID
        const asset = assetMap.get(node.data.target.sys.id);

        if (asset && imageContentTypes.includes(asset.contentType)) {
          // render the image asset accordingly
          return (
            <>
              {asset && asset.url ? (
                <div
                  className="image-embed"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={asset.url}
                    alt={asset.title}
                    height={asset.height}
                    width={asset.width}
                    quality={90}
                  />
                </div>
              ) : null}
            </>
          );
        }

        // @TODO can be done for other assets contentTypes like Audio, PDF...
        // HEVC mp4 videos will not be displayed in chrome, dual source video
        // is pretty impossible here, or create special content model
        // for embedded video insert universal web or mp4 encoded videos
        // use h_264 codec with baseline profile
        // that works in all browser, transparency will not be here

        if (asset && videoContentTypes.includes(asset.contentType)) {
          // render the image asset accordingly
          return (
            <>
              {asset && asset.url ? (
                <div
                  className="video-embed"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <video
                    width={"100%"}
                    height={"100%"}
                    controls
                    preload="metadata"
                  >
                    <source src={asset.url} type={asset.contentType} />
                    <p>
                      Sorry, your browser doesn’t support embedded videos, but
                      don’t worry, you can <a href={asset.url}>download it</a>{" "}
                      and watch it with your favorite video player!
                    </p>
                  </video>
                </div>
              ) : null}
            </>
          );
        }
      },
      // render block embedded entries
      // @TODO do same thing for the INLINES.EMBEDDED_ENTRY if need for inline embeds
      // reference implementation https://www.contentful.com/blog/2021/04/14/rendering-linked-assets-entries-in-contentful/
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        // find the entry in the entryMapBlock by ID
        const entry = entryMapBlock.get(node.data.target.sys.id);

        // its embedded "Link" content type, if we want to embed other types, implement it below
        if (entry && entry.__typename === "Link" && entry.slug) {
          //check if its Youtube url
          const allowYoutubeDomains = [
            "www.youtube.com",
            "youtu.be",
            "www.youtube-nocookie.com",
          ];
          if (allowYoutubeDomains.includes(new URL(entry.slug)?.hostname)) {
            const youtubeTitle = entry.name; // or entry.description
            const youtubeSrc = entry.slug;

            const regex = new RegExp(
              "^.*(?:(?:youtu.be/|v/|vi/|u/w/|embed/|shorts/)|(?:(?:watch)??v(?:i)?=|&v(?:i)?=))([^#&?]*).*"
            );
            const youtubeId = youtubeSrc.match(regex)[1];

            // render the asset accordingly
            return (
              <>
                {youtubeSrc.length && youtubeSrc.includes("youtube") ? (
                  <LiteYouTubeEmbed
                    id={youtubeId}
                    adNetwork={false}
                    params="rel=0&modestbranding=1&showinfo=0"
                    playlist={false}
                    playlistCoverId={youtubeId}
                    poster="maxresdefault"
                    title={youtubeTitle}
                    noCookie={true}
                  />
                ) : null}
              </>
            );
          }
        } else if (entry && entry.__typename === "HtmlBlock" && entry.html) {
          return <div dangerouslySetInnerHTML={{ __html: entry.html }} />;
        }
      },
    },
  };
}

import styles from "./PageRichTextSection.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import _ from "lodash";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { Link } from "@components/common";
import { PageImage, PageSectionWrapper } from "@components/page";
import { useEffect, useRef } from "react";
import loadjs from "loadjs";
import scrollTo from "@utils/scrollTo";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    html: PropTypes.string,
    body: PropTypes.shape({
      content: PropTypes.array.isRequired,
    }),
    link: PropTypes.object,
    center: PropTypes.bool,
    image: PropTypes.object,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
  pageData: PropTypes.object,
};

// https://www.contentful.com/blog/2021/04/14/rendering-linked-assets-entries-in-contentful/
// https://github.com/whitep4nth3r/contentful-graphql-vs-rest/blob/main/pages/rest.js
const renderRichTextOptionsRest = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const data = node.data.target.fields;
      const youtubeTitle =
        `Video: ${node.data.target.fields.name}` ?? "YouTube Video";
      const youtubeSrc = data.slug;
      const regex = new RegExp(
        "^.*(?:(?:youtu.be/|v/|vi/|u/w/|embed/|shorts/)|(?:(?:watch)??v(?:i)?=|&v(?:i)?=))([^#&?]*).*"
      );
      const youtubeId = youtubeSrc.match(regex)[1];

      if (youtubeSrc.length && youtubeSrc.includes("youtube")) {
        return (
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
        );
      }
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const image = _.get(node, "data.target");
      const width = _.get(image, "fields.file.details.image.width");
      const contentType = node.data.target.fields.file.contentType;

      if (width) {
        return (
          <div className={styles.richTextImage}>
            <PageImage image={image} width={width} layout="intrinsic" />
          </div>
        );
      } else if (contentType.includes("video")) {
        return (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className={cn(styles.richTextVideo)}
            controls
            preload="metadata"
          >
            <source src={node.data.target.fields.file.url} type={contentType} />
            <p>
              Sorry, your browser doesn’t support embedded videos, but don’t
              worry, you can{" "}
              <a href={node.data.target.fields.file.url}>download it</a> and
              watch it with your favorite video player!
            </p>
          </video>
        );
      } else {
        return null;
      }
    },
  },
};

// Component that renders the Connect Apps section of the home page
const PageRichTextSection = ({ fields, sections, index, pageData }) => {
  const image = _.get(fields, "image.fields") || _.get(fields, "image");
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const html = _.get(fields, "html");
  const body = _.get(fields, "body");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const center = _.get(fields, "center");
  const htmlContent = useRef(null);
  const pageSlug = pageData?.fields?.slug;

  const handleCannyPostMessage = (event) => {
    let { data } = event;

    if (typeof data === "string" && data.startsWith("[canny]")) {
      data = data.replace("[canny]", "");
      try {
        data = JSON.parse(data);
        if (
          data &&
          data.type === "path" &&
          data.data &&
          data.data.startsWith("/p/")
        ) {
          scrollTo("canny-iframe", -40);
        }
      } catch (e) {
        console.error("Error parsing canny post message");
      }
    }
  };

  useEffect(() => {
    if (
      htmlContent &&
      htmlContent.current &&
      htmlContent.current.innerHTML.includes('id="grnhse_app"')
    ) {
      loadjs("https://boards.greenhouse.io/embed/job_board/js?for=make", () => {
        setTimeout(() => {
          const exists = document.getElementById("grnhse_iframe");
          if (!exists && window.Grnhse.Settings.autoLoad) {
            window.Grnhse.Iframe.autoLoad();
          }
        }, 1000);
      });
    }
    if (
      htmlContent &&
      htmlContent.current &&
      htmlContent.current.innerHTML.includes("<div data-canny")
    ) {
      loadjs("https://canny.io/sdk.js", async () => {
        fetch("https://www.make.com/sso/canny/token", {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            let cannySsoToken = null;
            if (data.token) {
              cannySsoToken = data.token;
            }

            setTimeout(() => {
              const exists = document.getElementById("canny-iframe");
              if (!exists && window.Canny) {
                const urlObj = new URL(window.location);
                const urlArray = urlObj.pathname.split("/");
                const cannyBaseUrl = `/${urlArray[1]}/${urlArray[2]}`;

                let boardToken = process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN;
                if (urlArray[2] === "platform-ideas") {
                  // @TODO add all tokens to env variables
                  boardToken = "90fa1442-e93e-ba86-10ab-cffb09f8f637";
                }
                if (urlArray[2] === "app-ideas") {
                  boardToken = "1101e83a-ec5d-259c-7af1-fd8a3e75a1ef";
                }
                if (urlArray[2] === "app-improvement-ideas") {
                  boardToken = "4854aae7-a32c-fb75-740b-cc36c89a3108";
                }

                window.Canny("render", {
                  boardToken,
                  basePath: cannyBaseUrl,
                  ssoToken: cannySsoToken,
                });

                window.addEventListener("message", handleCannyPostMessage);
              }
            }, 100);
          })
          .catch((err) => console.error(err));
      });
    }

    return () => {
      window.removeEventListener("message", handleCannyPostMessage);
    };
  }, []);

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      {image ? (
        <div className={styles.headerContainer}>
          <div className={styles.headerImage}>
            <PageImage image={image} layout="fill" />
          </div>
        </div>
      ) : null}
      <div
        className={cn(
          "container",
          styles.pageSection,
          pageSlug ? styles[pageSlug] : "",
          center ? styles.center : ""
        )}
      >
        {subtitle ? <p>{subtitle}</p> : null}
        {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}{" "}
        {html && (
          <div
            dangerouslySetInnerHTML={{
              __html: html,
            }}
            ref={htmlContent}
          />
        )}
        {_.get(body, "content.length") > 0 &&
          documentToReactComponents(body, renderRichTextOptionsRest)}
        {_.get(link, "slug") && (
          <Link
            link={link}
            className={cn("button gradient", styles.pageSectionLink)}
          />
        )}
      </div>
    </PageSectionWrapper>
  );
};

PageRichTextSection.propTypes = propTypes;

export default PageRichTextSection;

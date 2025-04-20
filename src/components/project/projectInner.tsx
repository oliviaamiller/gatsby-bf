/** @jsx jsx */
/** @jsxFrag React.Fragment */ 

import * as React from "react";
import { css } from "@emotion/react";
import { Box, jsx } from "theme-ui";
import { Link } from "gatsby";
import RichText from "../../components/RichText";
import Carousel from "nuka-carousel";
import styled from "@emotion/styled";
import { ChevronLeft } from "@emotion-icons/bootstrap/ChevronLeft";
import { ChevronRight } from "@emotion-icons/bootstrap/ChevronRight";
import {
  carouselWrapCss,
  controlsStyles,
  footnoteStyles,
  controlsWrapStyles,
  NavButton,
  navButtonStyles,
  textSx
} from "../../components/project/styles";
import { ProjectInnerProps } from "./types";
import { getImageUrl } from "../../utils/getImageUrl";
import { Image } from "theme-ui";
import { useBreakpointIndex } from "@theme-ui/match-media";

const IconChevronRight = styled(ChevronRight)``;
const IconChevronLeft = styled(ChevronLeft)``;

export function ProjectInner({
  images,
  autoplay,
  slideIndex,
  setSlideIndex,
  nextItemIndex,
  projects,
  name,
  description,
  descriptionLink,
  descriptionLinkImage,
  category
}: ProjectInnerProps) {
  const isMobile = useBreakpointIndex() === 0;
  const showPagination = images?.length > 1 && isMobile;

  return (
    <React.Fragment>
      {images && !!images.length && (
        <Box css={carouselWrapCss}>
          <Carousel
            autoplay={autoplay}
            slideIndex={slideIndex}
            wrapAround={images?.length > 1}
            disableEdgeSwiping={images?.length <= 1}
            renderCenterRightControls={() => <></>}
            renderCenterLeftControls={() => <></>}
            renderTopLeftControls={({
              nextSlide,
              currentSlide
            }) => {
              const image = images?.[currentSlide];
              return (
                <Box sx={controlsWrapStyles}>
                  <Box sx={footnoteStyles}>
                    {image.description && <span>{image.description}</span>}
                  </Box>

                  <Box
                    sx={controlsStyles}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "absolute",
                      ...(isMobile && { left: "24px" })
                    }}
                  >
                   <Box>
                      {images.map((image, index) => (
                        <span
                          key={index}
                          onClick={() => setSlideIndex(index)}
                          style={{
                            display: "inline-block",
                            width: "6px", // size of the dot
                            height: "6px", // size of the dot
                            margin: "0 5px", // spacing between dots
                            borderRadius: "50%",
                            backgroundColor:
                              index === currentSlide ? "black" : "gray", // active dot is black
                            cursor: "pointer",
                            transition: "background-color 0.3s" // smooth transition for color change
                          }}
                        />
                      ))}
                    </Box>
                    {!isMobile && images?.length > 1 ? (
                      <NavButton
                        aria-label="Next Image"
                        as="button"
                        sx={{
                          color: "medium",
                          "&:hover": {
                            color: "dark"
                          }
                        }}
                        onClick={nextSlide}
                      >
                        <IconChevronRight   sx={{
                          height: "16px"
                        }} />
                      </NavButton>
                    ) : null}
                  </Box>
                </Box>
              );
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                style={{
                  aspectRatio: "377 / 219",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  sx={{
                    objectFit: "cover",
                    height: "100%"
                    // height: ["calc(100vh - 78px)", "100%"],
                  }}
                  src={getImageUrl(image.file.url)}
                  alt={
                    image?.description ||
                    `${name || ""} project image ${index + 1}`
                  }
                />
              </div>
            ))}
          </Carousel>

          <Box
            sx={{
              zIndex: 0,
              pointerEvents: "none",
              position: "absolute",
              right: ["10px", "0"],
              display: "flex",
              flex: "0 0 100%"
            }}
          ></Box>
        </Box>
      )}
      <Box
        sx={{
          p: [3, 0],
          // SIZES - PROJECT DESCRIPTION
          maxWidth: 9,
          margin: "0 auto",
          width: "100%"
        }}
      >
        <Box sx={{ fontSize: 1, marginTop: "75px" }}>
          {name ? <strong>{name}</strong> : null}
        </Box>

        {description?.raw && (
          <Box
            sx={{
              fontSize: 1,
              lineHeight: "22px",
              color: "medium",
              p: {
                mb: 5
              }
            }}
          >
            <RichText text={JSON.parse(description.raw)} />
          </Box>
        )}

        {descriptionLink && descriptionLinkImage && (
          <a href={descriptionLink} target="_blank" rel="noopener noreferrer">
            <img
              style={{ objectFit: "cover", height: "50px" }}
              src={descriptionLinkImage.file.url}
              alt={
                descriptionLinkImage?.description ||
                `${name || ""} Description Link Image`
              }
            />
          </a>
        )}
      </Box>
    </React.Fragment>
  );
}

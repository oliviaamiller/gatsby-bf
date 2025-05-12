const path = require(`path`);
const slug = require("slug");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type ContentfulPage implements Node {
      images: [ContentfulAsset]
    }

    type ContentfulAsset {
      title: String
      description: String
      file: ContentfulAssetFile
    }

    type ContentfulAssetFile {
      url: String
    }
  `);
};

const thumbnailFragment = `
thumbnail {
  title
  description
  file {
    url
  }
}
`;

const projectFragment = `
name
slug
autoplay
description {
  raw
}
descriptionLink
descriptionLinkImage {
  title
  description
  file {
    url
  }
}
${thumbnailFragment}
images {
  title
  description
  file {
    url
  }
}
`;

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const categoryPage = path.resolve(`src/pages/category.tsx`);
  const pagePage = path.resolve(`src/pages/page.tsx`);
  const projectPage = path.resolve(`src/pages/project.tsx`);

  return graphql(
    `
      {
        allContentfulHomePage {
          edges {
            node {
              id
              logo {
                file {
                  url
                }
              }
            }
          }
        }
        allContentfulPage {
          nodes {
            id
            name
            slug
            description {
              raw
            }
            descriptionLink
            descriptionLinkImage {
              title
              description
              file {
                url
              }
            }
            images {
              title
              file {
                url
              }
            }
          }
        }
        allContentfulCategory {
          edges {
            node {
              name
              slug
              showNameInDefaultState
              subCategory {
                name
                slug
                showNameInDefaultState
                ${thumbnailFragment}
                projects {
                  ${projectFragment}
                }
              }
              projects {
                ${projectFragment}
              }
            }
          }
        }
      }
    `,
    { limit: 1000 }
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    const {
      allContentfulCategory,
      allContentfulHomePage,
      allContentfulPage,
    } = result.data;

    const { edges: imagesRoot } = allContentfulHomePage;
    const rootNode = imagesRoot[0].node;
    const { logo } = rootNode;
    const { edges: categories } = allContentfulCategory;
    const { nodes: pages } = allContentfulPage;

    pages.forEach((page) => {
      createPage({
        path: `${slug(page.slug || "")}`,
        component: pagePage,
        context: {
          id: page.id,
          name: page.name,
          slug: page.slug,
          description: page.description,
          descriptionLinkImage: page.descriptionLinkImage,
          images: page.images,
          logo,
        },
      });
    });

    categories.forEach((category) => {
      createPage({
        path: `${slug(category.node.slug || "")}`,
        component: categoryPage,
        context: {
          category: category.node,
          projects: category.node.projects,
          categories: category.node.subCategory,
          id: category.node.id,
        },
      });

      if (category.node && category.node.project) {
        createPage({
          path: `${slug(category.node.slug)}/${slug(
            category.node.project.slug
          )}`,
          component: projectPage,
          context: {
            category: category.node,
            project: category.node.project,
            id: category.node.project.id,
          },
        });
      }

      category.node?.subCategory?.forEach((subCategory) => {
        createPage({
          path: `${slug(category.node.slug)}/${slug(subCategory.slug)}`,
          component: categoryPage,
          context: {
            projects: subCategory.projects,
            id: subCategory.id,
          },
        });

        subCategory.projects?.forEach((project) => {
          createPage({
            path: `${slug(category.node.slug)}/${slug(subCategory.slug)}/${slug(
              project.slug
            )}`,
            component: projectPage,
            context: {
              id: project.id,
              category: subCategory,
              projects: subCategory.projects,
              project,
            },
          });
        });
      });

      category.node.projects?.forEach((project) => {
        createPage({
          path: `${slug(category.node.slug)}/${slug(project.slug)}`,
          component: projectPage,
          context: {
            id: project.id,
            category: category.node,
            project,
            projects: category.node.projects,
            categories,
            logo,
            autoplay: project.autoplay,
          },
        });
      });
    });
  });
};

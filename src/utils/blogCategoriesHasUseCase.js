import _ from "lodash";
/**
 * Takes blog data, grabs categories, sees if it includes use-cases, returns boolean.
 * @param {object} blogData - The blog from which categories are parsed from.
 */
export default function blogCategoriesHasUseCase(blogData) {
  const categories = _.get(blogData, "categoriesCollection.items") || [];
  return (categories || [])
    .map((category) => {
      return category.slug === "use-cases";
    })
    .includes(true);
}

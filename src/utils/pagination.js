const pageSize = 10;
exports.postPagination = (query) => {
  const { page = 0, limit = 25, sortBy = "createdAt:asc" } = query || {};

  console.log(page, limit, sortBy);

  const sort = {};
  if (sortBy) {
    const part = sortBy.split(":");
    sort[part[0]] = part[1] === "desc" ? -1 : 1;
  }

  return {
    skip: Math.max(0, page * pageSize),
    limit: Math.max(1, limit),
    sort,
  };
};

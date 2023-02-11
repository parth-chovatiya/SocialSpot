exports.pageSize = 10;

// pagination -> ?page=1&limit=10&sortBy=createdAt:asc
exports.postPagination = (query) => {
  const { page = 0, limit = 25, sortBy = "createdAt:asc" } = query || {};

  const sort = {};
  if (sortBy) {
    const part = sortBy.split(":");
    sort[part[0]] = part[1] === "desc" ? -1 : 1;
  }

  return {
    skip: Math.max(0, page * this.pageSize),
    limit: Math.max(1, limit),
    sort,
  };
};

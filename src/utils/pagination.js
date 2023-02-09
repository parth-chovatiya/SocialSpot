exports.postPagination = (query) => {
  const { skip = 0, limit = 25, sortBy = "createdAt:asc" } = query || {};

  const sort = {};
  if (sortBy) {
    const part = sortBy.split(":");
    sort[part[0]] = part[1] === "desc" ? -1 : 1;
  }

  return { skip: Math.max(0, skip), limit: Math.max(1, limit), sort };
};

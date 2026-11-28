const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Read ?page=&limit= from the URL and turn them into safe numbers
export const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Turn ?sort=new|top into a MongoDB sort object
export const buildSort = (sort) => {
  if (sort === 'top') {
    // Highest score first, then newest, then _id so the order is always the same
    return { score: -1, createdAt: -1, _id: -1 };
  }

  // Default: newest first (_id breaks ties between posts with the same time)
  return { createdAt: -1, _id: -1 };
};

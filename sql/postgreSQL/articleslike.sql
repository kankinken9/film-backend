ALTER TABLE articleslikes
ADD CONSTRAINT NoDuplicateLike UNIQUE (articleID, userID);

ON CONFLICT ON CONSTRAINT  NoDuplicateLike  
DO NOTHING;

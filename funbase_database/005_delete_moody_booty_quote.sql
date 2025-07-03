-- Migration: Remove unwanted quote from the quotes table (FunBase)
-- Deletes: 'Why be moody when you can shake your booty!'

DELETE FROM quotes
WHERE text = 'Why be moody when you can shake your booty!';

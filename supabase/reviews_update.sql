-- Add images_url to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS images_url TEXT[] DEFAULT '{}';

-- Function to update product average rating
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE public.products
        SET average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.reviews
            WHERE product_id = NEW.product_id
        )
        WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.products
        SET average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.reviews
            WHERE product_id = OLD.product_id
        )
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for reviews
DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;
CREATE TRIGGER on_review_changed
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE PROCEDURE public.update_product_rating();

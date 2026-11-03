INSERT INTO time_master (
    t_date,
    t_day,
    t_day_no,
    t_month,
    t_year,
    t_week,
    t_quarter
)
SELECT
    d::date AS t_date,
    TO_CHAR(d, 'Day') AS t_day,
    EXTRACT(DOW FROM d)+1::int AS t_day_no,
    EXTRACT(MONTH FROM d)::int AS t_month,
    EXTRACT(YEAR FROM d)::int AS t_year,
--    EXTRACT(WEEK FROM d)::int AS t_week,
    FLOOR((d::date - DATE_TRUNC('year', d)::date) / 7) + 1 AS t_week,
    'Q' || EXTRACT(QUARTER FROM d)::int AS t_quarter
FROM generate_series(
    DATE '2020-01-01',
    DATE '2030-12-31',
    INTERVAL '1 day'
) AS d;

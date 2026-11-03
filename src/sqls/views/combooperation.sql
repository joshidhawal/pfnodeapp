CREATE VIEW view_combo_opt(
    operation_id,
    operation_type,
    data_type,
    operating_amount,
    user_id,
    account_id,
    operation_date
) as
select operation_id,operation_type,data_type, operating_amount, user_id, account_id, operation_date from one_time_operation
union all
SELECT
    o.operation_id,
    o.operation_type,
    o.data_type,
    o.operating_amount,
    o.user_id,
    o.account_id,
    tm.t_date AS operation_date
FROM operations o
JOIN time_master tm
    ON tm.t_date BETWEEN o.start_date AND o.end_date
WHERE MOD((tm.t_date - o.start_date), o.frequency) = 0;

import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  name: "vw_generate_tranasctions",
  // materialized: true, // <--- Turns it into a Materialized View for instant reads
  expression: `
  select o.operation_id,
o.operation_type,o.data_type, 
--o.frequency ,
t.t_date as transaction_date,
--date(o.start_date) as start_date, date(o.end_date) as end_date ,
o.operating_amount, o.user_id,o.account_id
from operations o, time_master t
where t.t_date between date(o.start_date) and date(o.end_date)
and (t.t_date - date(o.start_date) ) % o.frequency = 0
and o.end_date >= t_date
union
select o.operation_id ,o.operation_type, o.data_type, date(o.operation_date) as transaction_date,
o.operating_amount , o.user_id, o.account_id
from one_time_operation o
order by transaction_date,operation_id
`,
})
export class GenerateTransactionsView {
  @ViewColumn({ name: "operation_id" })
  operationId!: string;

  @ViewColumn({ name: "operation_type" })
  operationType!: string;

  @ViewColumn({ name: "data_type" })
  dataType!: string;

  @ViewColumn({ name: "transaction_date" })
  transactionDate!: Date;

  @ViewColumn({ name: "operating_amount" })
  operatingAmount!: number;

  @ViewColumn({ name: "user_id" })
  userId!: string;

  @ViewColumn({ name: "account_id" })
  accountId!: string;
}

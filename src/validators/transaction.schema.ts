import z from "zod";

import { RecordStatus, TransactionFrequency } from "../enums/enum.js";

export const OperationMainSchema = z.object({
  operationId: z.string().nonempty("Operation ID is required"),
  userId: z.string().nonempty("User ID is required"),
  accountId: z.string().nonempty("Account ID is required"),
  operationType: z.string().nonempty("Operation Type is required"),
  dataType: z.string().nonempty("Data Type is required"),
  operatingAmount: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Invalid number",
    })
    .refine((val) => Number(val.toFixed(4)) === val, {
      message: "Max 4 decimal places allowed",
    })
    .default(0),
  frequency: z
    .union(
      [
        z.literal(TransactionFrequency.Daily),
        z.literal(TransactionFrequency.Week),
        z.literal(TransactionFrequency.Month),
        z.literal(TransactionFrequency.Quarter),
        z.literal(TransactionFrequency.Year),
      ],
      {
        error:
          "Frequency must be Daily(1), Week(7), Month(30), Quarter(90), or Year(365)",
      },
    )
    .default(TransactionFrequency.Week),
  startDate: z.coerce.date("Start Date is required."),
  endDate: z.coerce.date("End Date is required."),
  status: z.string().default(RecordStatus.NEW),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const OtoMainSchema = z.object({
  operationId: z.string().nonempty("Operation ID is required"),
  userId: z.string().nonempty("User ID is required"),
  accountId: z.string().nonempty("Account ID is required"),
  operationType: z.string().nonempty("Operation Type is required"),
  dataType: z.string().nonempty("Data Type is required"),
  operatingAmount: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Invalid number",
    })
    .refine((val) => Number(val.toFixed(4)) === val, {
      message: "Max 4 decimal places allowed",
    })
    .default(0),
  operationDate: z.coerce.date("Operation Date is required."),
  status: z.string().default(RecordStatus.NEW),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const transactionMainSchema = z.object({
  transactionId: z.string().nonempty("Transaction ID is required"),
  transactionDate: z.coerce.date("Transaction Date is required."),
  userId: z.string().nonempty("User ID is required"),
  accountId: z.string().nonempty("Account ID is required"),
  initialAmount: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Invalid number",
    })
    .refine((val) => Number(val.toFixed(4)) === val, {
      message: "Max 4 decimal places allowed",
    })
    .default(0),
  operationType: z.string().nonempty("Operation Type is required"),
  status: z.string().default(RecordStatus.NEW),
  operatingAmount: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Invalid number",
    })
    .refine((val) => Number(val.toFixed(4)) === val, {
      message: "Max 4 decimal places allowed",
    })
    .default(0),
  endAmount: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Invalid number",
    })
    .refine((val) => Number(val.toFixed(4)) === val, {
      message: "Max 4 decimal places allowed",
    })
    .default(0),
  transactionType: z.string().nonempty("Transaction Type is required"),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const singleTransactionSchema = transactionMainSchema.pick({
  transactionId: true,
  transactionDate: true,
  userId: true,
  accountId: true,
  initialAmount: true,
  operationType: true,
  status: true,
  operatingAmount: true,
  endAmount: true,
  transactionType: true,
  createdBy: true,
  modifiedBy: true,
});

// export const createTransactionSchema = z.union([
//   singleTransactionSchema,
//   z.array(singleTransactionSchema),
// ]);

export const createTransactionSchema = z.array(singleTransactionSchema);

export const createOperationSchema = OperationMainSchema.pick({
  operationId: true,
  userId: true,
  accountId: true,
  operationType: true,
  dataType: true,
  operatingAmount: true,
  frequency: true,
  startDate: true,
  endDate: true,
  status: true,
  createdBy: true,
  modifiedBy: true,
});

export const createOtoSchema = OtoMainSchema.pick({
  operationId: true,
  userId: true,
  accountId: true,
  operationType: true,
  dataType: true,
  operatingAmount: true,
  operationDate: true,
  status: true,
  createdBy: true,
  modifiedBy: true,
});

export const getOtoSchema = OtoMainSchema.pick({
  userId: true,
  accountId: true,
})
  .extend(
    OperationMainSchema.pick({
      startDate: true,
      endDate: true,
    }).shape,
  )
  .partial({
    accountId: true,
    startDate: true,
    endDate: true,
  })
  .superRefine((data, ctx) => {
    const hasStart = !!data.startDate;
    const hasEnd = !!data.endDate;

    // Either both or neither
    if (hasStart !== hasEnd) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "startDate and endDate must be provided together",
      });
    }

    // Date range validation
    if (
      data.startDate &&
      data.endDate &&
      data.startDate.getTime() > data.endDate.getTime()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "endDate must be greater than or equal to startDate",
      });
    }
  });

export const getOperationSchema = OperationMainSchema.pick({
  userId: true,
  accountId: true,
  startDate: true,
  endDate: true,
})
  .partial({
    accountId: true,
    startDate: true,
    endDate: true,
  })
  .superRefine((data, ctx) => {
    const hasStart = !!data.startDate;
    const hasEnd = !!data.endDate;

    // Either both or neither
    if (hasStart !== hasEnd) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "startDate and endDate must be provided together",
      });
    }

    // Date range validation
    if (
      data.startDate &&
      data.endDate &&
      data.startDate.getTime() > data.endDate.getTime()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "endDate must be greater than or equal to startDate",
      });
    }
  });

export const getTransactionsSchema = z
  .object({
    userId: transactionMainSchema.shape.userId.array(),
    accountId: transactionMainSchema.shape.accountId.array().optional(),
    transactionId: transactionMainSchema.shape.transactionId.array().optional(),
    startDate: OperationMainSchema.shape.startDate.optional(),
    endDate: OperationMainSchema.shape.endDate.optional(),
  })
  .superRefine((data, ctx) => {
    const hasStart = !!data.startDate;
    const hasEnd = !!data.endDate;

    // Either both or neither
    if (hasStart !== hasEnd) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "startDate and endDate must be provided together",
      });
    }

    // Date range validation
    if (
      data.startDate &&
      data.endDate &&
      data.startDate.getTime() > data.endDate.getTime()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "endDate must be greater than or equal to startDate",
      });
    }
  });

export const getOperationByIdSchema = OperationMainSchema.pick({
  operationId: true,
});

export const getOtoByIdSchema = OtoMainSchema.pick({
  operationId: true,
});

export const updateOperationByIdSchema = OperationMainSchema.pick({
  operationId: true,
  userId: true,
  accountId: true,
  operationType: true,
  dataType: true,
  operatingAmount: true,
  frequency: true,
  startDate: true,
  endDate: true,
  status: true,
  modifiedBy: true,
}).partial({
  userId: true,
  accountId: true,
  operationType: true,
  dataType: true,
  operatingAmount: true,
  frequency: true,
  startDate: true,
  endDate: true,
  status: true,
  modifiedBy: true,
});

export const updateOtoByIdSchema = OtoMainSchema.pick({
  operationId: true,
  userId: true,
  accountId: true,
  operationType: true,
  dataType: true,
  operatingAmount: true,
  operationDate: true,
  status: true,
  modifiedBy: true,
}).partial({
  userId: true,
  accountId: true,
  operationType: true,
  dataType: true,
  operatingAmount: true,
  operationDate: true,
  status: true,
  modifiedBy: true,
});

export const deleteOperationSchema = OperationMainSchema.pick({
  operationId: true,
});

export const deleteOtoSchema = OtoMainSchema.pick({
  operationId: true,
});

export const updateTransactionSchema = z.array(
  transactionMainSchema
    .pick({
      transactionId: true,
      transactionDate: true,
      userId: true,
      accountId: true,
      initialAmount: true,
      operationType: true,
      status: true,
      operatingAmount: true,
      endAmount: true,
      transactionType: true,
      modifiedBy: true,
    })
    .partial({
      transactionDate: true,
      initialAmount: true,
      operationType: true,
      status: true,
      operatingAmount: true,
      endAmount: true,
      transactionType: true,
    }),
);

export const deleteTransactionSchema = getTransactionsSchema;

export const generateTransactionsSchema = OperationMainSchema.pick({
  userId: true,
  startDate: true,
  endDate: true,
}).extend({
  accountId: OperationMainSchema.shape.accountId.array().optional(),
});

export const generatedTransactionsSchema = OtoMainSchema.pick({
  operationId: true,
  userId: true,
  accountId: true,
  operationType: true,
  dataType: true,
  operatingAmount: true,
  operationDate: true,
  status: true,
}).transform(({ operationDate, ...rest }) => ({
  ...rest,
  transactionDate: operationDate,
}));

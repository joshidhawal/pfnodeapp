import z from "zod";

import { RecordStatus } from "../enums/enum.js";

export const accountGroupSchema = z.object({
  groupId: z.string().nonempty("Group ID is required"),
  accountId: z.string().nonempty("Account ID is required"),
  groupName: z.string().nonempty("Group Name is required"),
  status: z.string().default(RecordStatus.NEW),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const createAccountGroupsSchema = accountGroupSchema
  .pick({
    groupId: true,
    groupName: true,
    status: true,
    createdBy: true,
    modifiedBy: true,
  })
  .extend({ accountId: accountGroupSchema.shape.accountId.array() });

export const getAccountGroupsSchema = accountGroupSchema
  .pick({
    groupId: true,
    accountId: true,
  })
  .partial({
    accountId: true,
  });

export const getAcGroupInfoSchema = accountGroupSchema.shape.groupId;

export const updateAccountGroupsSchema = z.array(
  accountGroupSchema.pick({
    groupId: true,
    accountId: true,
    modifiedBy: true,
  }),
);

export const updateAcGroupInfoSchema = accountGroupSchema.pick({
  groupId: true,
  groupName: true,
  status: true,
  modifiedBy: true,
});

// export const deleteAccountGroupsSchema = accountGroupSchema
//   .pick({
//     groupId: true,
//     accountId: true,
//   })
//   .partial()
//   .refine((data) => data.groupId || data.accountId, {
//     message: "Either groupId or accountId must be provided.",
//   });

export const deleteAccountGroupsSchema = z
  .object({
    groupId: accountGroupSchema.shape.groupId.array().optional(),
    accountId: accountGroupSchema.shape.accountId.array().optional(),
  })
  .refine(
    (data) => {
      const hasGroups = data.groupId && data.groupId.length > 0;
      const hasAccounts = data.accountId && data.accountId.length > 0;
      return hasGroups || hasAccounts;
    },
    {
      message: "At least one group ID or account ID must be provided.",
      path: ["groupId"], // Attaches the error to the groupId field (or leave path out for a root error)
    },
  );

export const deleteAcGroupInfoSchema = accountGroupSchema.shape.groupId;

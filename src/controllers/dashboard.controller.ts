// import { RecordStatus } from "../enums/enum.js";
// import { validateRequest } from "../middlewares/validate.middleware.js";
// import { AppLogger } from "../services/logger.service.js";
// import { AccountTypes } from "../types/app/types.js";
// import { catchAsync } from "../utils/catchAsync.js";
// import { sendResponseJSON } from "../utils/send-res.util.js";
// import { createAccountSchema } from "../validators/account.schema.js";

// const accountRepository = AppDataSource.getRepository(Account);
// const dashboardService = new DashboardService(dashboardRepository);
// const logger = AppLogger.getChildLogger("DashboardController");

// export const createAccount = catchAsync(async (req: Request, res: Response) => {
//   logger.info(`Create Account Request Data is : ${JSON.stringify(req.body)}`);
//   const createAccountData = validateRequest(createAccountSchema, {
//     createdBy: req.user?.userId,
//     modifiedBy: req.user?.userId,
//     status: RecordStatus.NEW,
//     ...req.body,
//   });

//   logger.info(
//     `Create Account Validated Request Data is : ${JSON.stringify(
//       createAccountData,
//     )}`,
//   );

//   const account: AccountTypes =
//     await accountService.createAccount(createAccountData);
//   sendResponseJSON(res, 201, account);
// });

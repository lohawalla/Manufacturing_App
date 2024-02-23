export const basePath = `https://chawlacomponents.com`;

// export const basePath = `https://hrms-backend-04fw.onrender.com`;

// export const basePath =`http://fe80::1100:6a39:7022:4793%17:5050`

// WORK ORDER APIs
export const getAllWorkOrdersApiPath = `${basePath}/api/v1/workOrder/getWorkOrderApp`;
export const getSingleWorkOrderApiPath = `${basePath}/api/v1/workOrder`;


//getMachineApi
export const getMachineApiPath = `${basePath}/api/v1/productionSlip/getIdleActiveMachines`

//getIdleEmployees
export const getEmployeeApiPath = `${basePath}/api/v1/productionSlip/getIdleActiveEmployees`

//generate Production SLip

export const generateProductionApiPath = `${basePath}/api/v1/productionSlip/addMultiple`

//get Production Slip
export const scanProductionSlipApiPath = `${basePath}/api/v1/productionSlip/prd`

//get current slips

export const getCurrentActiveSlips = `${basePath}/api/v1/productionSlip/getActive`

//get Machines Suggestions

export const getMachineSuggestionsApiPath = `${basePath}/api/v1/productionSlip/machineSuggestion`

// https://hrms-backend-04fw.onrender.com/api/v1/productionSlip/machineSuggestion/DWX5505-B027-1-0012

//get Employee Suggestions

export const getEmployeeSuggestionsApiPath = `${basePath}/api/v1/productionSlip/employeeSuggestion`


// Allot Work

export const allotWorkApiPath = `${basePath}/api/v1/productionSlip/addEmployeeMachine`


// find employee by QR

export const findEmployeeByQrApiPath = `${basePath}/api/v2/attendance/find-employee-by-Qr`



//find Machine By Qr

export const findMachineByQrApiPath = `${basePath}/api/v1/machine/getMachineByQr`



//Auto Select Employee

export const autoSelectApiPath = `${basePath}/api/v1/productionSlip/autoSelect`




export const getCurrentLogsApiPath = `${basePath}/api/v1/productionSlip/getAllChildPartWithSlip1`


//get all CNC program Logs

export const getAllLogsCNCApiPath = `${basePath}/api/v1/cnc/logs`;

//get All Programs 

export const getAllProgramsApiPath = `${basePath}/api/v1/cnc/getAllPlanning`;

// Create Logs

export const createLogsApiPath = `${basePath}/api/v1/cnc/createLogNew`;


// Fetch Profile Picture

export const fetchProfilesApiPath = `${basePath}/api/v1/auth/myprofile`;

//get Punches and punchOut of single employee

export const getPunchesandPunchOutOfSingleEmployeeApiPath = `${basePath}/api/v2/attendance/singleEmployee`;

// Edit Production

export const editProductionApiPath = `${basePath}/api/v1/productionSlip/editProduction`

//Productivity

export const employeeProductivityApiPath = `${basePath}/api/v1/report/getReportApp`

// get Work order with child parts 

export const getWorkOrderByChildPartApiPath = `${basePath}/api/v1/cnc/getWorkOrderByChildPart`

// 

export const getWorkOrderByChildPartByWorkOrderAPIPath = `${basePath}/api/v1/inventory/singlePartInventory`

// get Slips Furthur Data
export const getSlipsOneDetailApiPath = `${basePath}/api/v1/productionSlip/getProductionSlipDetail/`

//get Remaining Quantity

export const getRemainingQuantityApiPath = `${basePath}/api/v1/productionSlip/prd/`

// get negative inventory 

export const getNegativeInventoryApiPath = `${basePath}/api/v1/inventory/workOrderNegativeCount`;

// get dailyLogs Report 

export const getDailyLogsReportApiPath = `${basePath}/api/v1/cnc/dailyLogs/`;

// shop shift timings

export const getShopShiftTimingsReportApiPath = `${basePath}/api/v1/shop/addShiftInShop`;

// shop/getShopLog

export const getShopLogApiPath = `${basePath}/api/v1/shop/getShopLog`;


export const getAllSlipsWithShop = `${basePath}/api/v1/productionSlip/getAll`

export const randomThoughts = `https://hindi-quotes.vercel.app/random/success`
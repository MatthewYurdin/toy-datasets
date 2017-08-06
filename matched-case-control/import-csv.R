setwd('/Users/matty/Documents/Toy-Datasets/matched-case-control')
mcc <- read.csv("MCC_U_stats_051708.csv", header = TRUE, sep = ",", na.strings = "")
saveRDS(mcc, "mcc_summary.rds")
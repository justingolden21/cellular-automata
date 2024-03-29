// https://arxiv.org/pdf/1306.5577.pdf
const RULE_CLASSIFICATIONS = {
	// class 1, 2, 3, and 4. doesn't include equivalent rules
	1: [0, 8, 32, 40, 128, 136, 160, 168],
	2: [
		1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 19, 23, 24, 25, 26, 27,
		28, 29, 33, 34, 35, 36, 37, 38, 42, 43, 44, 46, 50, 51, 56, 57, 58, 62,
		72, 73, 74, 76, 77, 78, 94, 104, 108, 130, 132, 134, 138, 140, 142, 152,
		154, 156, 162, 164, 170, 172, 178, 184, 200, 204, 232,
	],
	3: [18, 22, 30, 45, 60, 90, 105, 122, 126, 146, 150],
	4: [41, 54, 106, 110],
};

const EQUIVALENT_RULES = {
	0: [255],
	1: [127],
	2: [16, 191, 247],
	3: [17, 63, 119],
	4: [223],
	5: [95],
	6: [20, 159, 215],
	7: [21, 31, 87],
	8: [64, 239, 253],
	9: [65, 111, 125],
	10: [80, 175, 245],
	11: [47, 81, 117],
	12: [68, 207, 221],
	13: [69, 79, 93],
	14: [84, 143, 213],
	15: [85],
	18: [183],
	19: [55],
	22: [151],
	23: [],
	24: [66, 189, 231],
	25: [61, 67, 103],
	26: [82, 167, 181],
	27: [39, 53, 83],
	28: [70, 157, 199],
	29: [71],
	30: [86, 135, 149],
	32: [251],
	33: [123],
	34: [48, 187, 243],
	35: [49, 59, 115],
	36: [219],
	37: [91],
	38: [52, 155, 211],
	40: [96, 235, 249],
	41: [97, 107, 121],
	42: [112, 171, 241],
	43: [113],
	44: [100, 203, 217],
	45: [75, 89, 101],
	46: [116, 139, 209],
	50: [179],
	51: [],
	54: [147],
	56: [98, 185, 227],
	57: [99],
	58: [114, 163, 177],
	60: [102, 153, 195],
	62: [118, 131, 145],
	72: [237],
	73: [109],
	74: [88, 173, 229],
	76: [205],
	77: [],
	78: [92, 141, 197],
	90: [165],
	94: [133],
	104: [233],
	105: [],
	106: [120, 169, 225],
	108: [201],
	110: [124, 137, 193],
	122: [161],
	126: [129],
	128: [254],
	130: [144, 190, 246],
	132: [222],
	134: [148, 158, 214],
	136: [192, 238, 252],
	138: [174, 208, 244],
	140: [196, 206, 220],
	142: [212],
	146: [182],
	150: [],
	152: [188, 194, 230],
	154: [166, 180, 210],
	156: [198],
	160: [250],
	162: [176, 186, 242],
	164: [218],
	168: [224, 234, 248],
	170: [240],
	172: [202, 216, 228],
	178: [],
	184: [226],
	200: [236],
	204: [],
	232: [],
};

const CLASSIFICATION_DESCRIPTIONS = {
	1: 'uniform',
	2: 'periodic',
	3: 'chaotic',
	4: 'complex',
};

function getRuleClassification(ruleNum) {
	// if ruleNum is an equvalent rule, find the corresponding ruleNum
	if (!Object.keys(EQUIVALENT_RULES).includes(ruleNum.toString())) {
		for (let key in EQUIVALENT_RULES) {
			if (EQUIVALENT_RULES[key].includes(ruleNum)) {
				ruleNum = parseInt(key);
				break;
			}
		}
	}

	for (let key in RULE_CLASSIFICATIONS) {
		if (RULE_CLASSIFICATIONS[key].includes(ruleNum)) {
			return key;
		}
	}
	console.error('invalid rule number');
}

const getClassificationDescription = (classification) =>
	`evolves to ${CLASSIFICATION_DESCRIPTIONS[classification]} behavior`;

function getEquivalentRules(ruleNum) {
	if (Object.keys(EQUIVALENT_RULES).includes(ruleNum.toString())) {
		return EQUIVALENT_RULES[ruleNum];
	}

	let parentRuleNum;
	for (let key in EQUIVALENT_RULES) {
		if (EQUIVALENT_RULES[key].includes(ruleNum)) {
			parentRuleNum = parseInt(key);
			break;
		}
	}
	let newArr = [...EQUIVALENT_RULES[parentRuleNum]]; // copy it
	newArr.push(parentRuleNum); // add parent
	newArr.splice(newArr.indexOf(ruleNum), 1); // remove current
	return newArr;
}

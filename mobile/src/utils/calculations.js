// A completely isolated math engine for calculating TDEE & Macros!
export const calculateNutrition = (age, weightKg, heightCm, gender, activityLevel, goal) => {
    // 1. Convert any typed text into raw strict numbers
    const a = Number(age);
    const w = Number(weightKg);
    const h = Number(heightCm);

    // 2. Basal Metabolic Rate (Mifflin-St Jeor formula)
    let bmr;
    if (gender === 'female') {
        bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    } else {
        // Defaults to male math if 'other' or 'male'
        bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    }

    // 3. Activity Multipliers
    const multipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725
    };

    // Calculates TDEE (Defaults safely avoiding crashes)
    let tdee = bmr * (multipliers[activityLevel] || 1.2);

    // 4. Goal Adjustments
    let dailyCalories = tdee;
    if (goal === 'lose_weight') dailyCalories -= 500;
    if (goal === 'build_muscle') dailyCalories += 500;
    // general_health and improve_endurance stay at exact maintenance calories

    // 5. Standard Macro Split (30% Protein, 40% Carbs, 30% Fats)
    const pCals = dailyCalories * 0.30;
    const fCals = dailyCalories * 0.30;
    const cCals = dailyCalories * 0.40;

    // Convert calories to Grams (1g Protein = 4 cals, 1g Fat = 9 cals, 1g Carb = 4 cals)
    const protein = pCals / 4;
    const fats = fCals / 9;
    const carbs = cCals / 4;

    // Return the neatly packaged final results!
    return {
        calories: Math.round(dailyCalories),
        protein: Math.round(protein),
        fats: Math.round(fats),
        carbs: Math.round(carbs)
    };
};

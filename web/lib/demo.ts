/** Pre-written sample conversations for the static demo (no API key needed). */
export type DemoScenario = { label: string; prompt: string; reply: string };

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    label: "Two-day headache",
    prompt: "I've had a headache for two days. What could it be?",
    reply: `A headache lasting a couple of days is common and usually not serious. Some likely causes:

- **Tension-type headache**: a tight band or pressure, often linked to stress, posture or long screen time
- **Dehydration, skipped meals or poor sleep**
- **Caffeine withdrawal** if you've cut back recently
- **A cold or sinus congestion**, especially with a blocked nose or pressure around the eyes

**What usually helps:** drink water regularly, eat at normal times, rest your eyes from screens, and get a proper night's sleep. An over-the-counter pain reliever such as paracetamol or ibuprofen, taken as directed on the label, can help, but try not to use them for more than a few days in a row.

**See a doctor if** it keeps coming back, gets steadily worse, or doesn't ease within a few more days.

**Get urgent help** if the headache is sudden and severe ("the worst ever"), or comes with fever and a stiff neck, confusion, weakness, vision changes, or follows a head injury.

To give you a better answer: how old are you, where is the pain, and have you noticed any other symptoms?`,
  },
  {
    label: "Fever of 38.5 °C",
    prompt: "My temperature is 38.5°C. Should I be worried?",
    reply: `For an adult, 38.5 °C is a mild to moderate fever. It's most often the body fighting a viral infection, and it usually settles within a few days.

**What usually helps**
- Rest and plenty of fluids
- Light clothing and a comfortable room temperature
- Paracetamol or ibuprofen, as directed on the label, if you feel unwell

**Contact a doctor if**
- The fever lasts more than 3 days, or reaches 39.4 °C or higher
- You have a long-term condition or a weakened immune system
- You're getting worse instead of better

**Get urgent help** for a stiff neck, a rash that doesn't fade when you press a glass against it, confusion, trouble breathing, chest pain, or a seizure.

If this is about a baby under 3 months old, any temperature of 38 °C or above needs a doctor straight away.

Is this for you or someone else, and how long has the fever lasted?`,
  },
  {
    label: "Chest pain (emergency)",
    prompt: "I have sudden chest pain spreading to my left arm.",
    reply: `**This could be a heart attack. Please call your local emergency number now** (112 in India, 911 in the US, 999 in the UK).

While you wait:
- Stop what you're doing and sit down to rest
- Don't drive yourself to hospital
- Follow the emergency operator's instructions; they may advise chewing an aspirin if you aren't allergic to it
- Unlock the door and, if you can, let someone nearby know

Please don't wait to see if it passes. Getting help quickly makes a real difference.`,
  },
];

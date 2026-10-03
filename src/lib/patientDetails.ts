export function calculateAge(dateOfBirth?: string | Date | null): number | null {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPending = today.getMonth() < birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (birthdayPending) age -= 1;
  return age >= 0 ? age : null;
}

export function formatGender(gender?: string | null): string {
  if (!gender) return "N/A";
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

export function formatBloodGroupValue(bloodGroup?: string | null): string {
  if (!bloodGroup) return "N/A";
  return bloodGroup.replace(/_POSITIVE/gi, "+").replace(/_NEGATIVE/gi, "-");
}

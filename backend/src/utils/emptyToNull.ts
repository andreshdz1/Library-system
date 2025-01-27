//this function is just to transform string values to null which
//came from the front end, (postgres cant handle null as empty)
export function emptyToNull(dto: any): any {
  const transformedDto = { ...dto };
  for (const key in transformedDto) {
    if (transformedDto[key] === '') {
      transformedDto[key] = null;
    }
  }
  return transformedDto;
}

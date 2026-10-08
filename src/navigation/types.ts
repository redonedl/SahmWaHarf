export type RootStackParamList = {
  Landing: undefined;
  Categories: undefined;
  LevelSelection: { categoryId: string };
  Game: { categoryId: string; levelId: number };
};

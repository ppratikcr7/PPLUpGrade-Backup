import { IsNotEmpty, IsDefined, IsNumber } from 'class-validator';
import { SORT_AS } from 'packages/Upgrade/src/types';

// TODO: Move to upgrade types
export interface IFeatureFlagSearchParams {
  key: FLAG_SEARCH_SORT_KEY;
  string: string;
}
export interface IFeatureFlagSortParams {
  key: FLAG_SEARCH_SORT_KEY;
  sortAs: SORT_AS;
}

export enum FLAG_SEARCH_SORT_KEY {
  ALL = 'all',
  NAME = 'name',
  KEY = 'key',
  STATUS = 'status',
  VARIATION_TYPE = 'variationType',
}

export class FeatureFlagPaginatedParamsValidator {
  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public skip: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public take: number;

  public searchParams: IFeatureFlagSearchParams;

  public sortParams: IFeatureFlagSortParams;
}

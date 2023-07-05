import { CreateApp1686744033397 } from '@/migrations/1686744033397-createApp';
import { CreateForm1686744042985 } from '@/migrations/1686744042985-createForm';
import { CreateComponent1686744049159 } from '@/migrations/1686744049159-createComponent';
import { CreateFormPermission1686744063864 } from '@/migrations/1686744063864-createFormPermission';
import { CreateFormTemplate1686744070031 } from '@/migrations/1686744070031-createFormTemplate';
import { CreateTheme1686744077833 } from '@/migrations/1686744077833-createTheme';
import { AddFormStatus1686812180878 } from '@/migrations/1686812180878-addFormStatus';
import {
  RemoveAllTableDeleted1686831139363,
} from '@/migrations/1686831139363-removeAllTableDeleted';
import {
  UpdateFormAndPermission1686880628843,
} from '@/migrations/1686880628843-updateFormAndPermission';
import { UpdateAllCreatorId1686884780374 } from '@/migrations/1686884780374-updateAllCreatorId';
import { CreateFormStore1686896869942 } from '@/migrations/1686896869942-createFormStore';
import { UpdateFormTemplate1686910481462 } from '@/migrations/1686910481462-updateFormTemplate';
import { UpdateComponent1686911420401 } from '@/migrations/1686911420401-updateComponent';
import { AddFromColumns1687160311778 } from '@/migrations/1687160311778-addFromColumns';
import { AddFormScene1687174439017 } from '@/migrations/1687174439017-addFormScene';
import {
  AddTableNameForFormStore1687700611399
} from '@/migrations/1687700611399-addTableNameForFormStore';
import {
  AddPublishFieldFromForm1687850164758
} from '@/migrations/1687850164758-addPublishFieldFromForm';
import {
  AddFormAndDataPermissionsFromFormPermission1687856139669
} from '@/migrations/1687856139669-addFormAndDataPermissionsFromFormPermission';
import {
  AddComponentDataFromComponent1688117466349
} from '@/migrations/1688117466349-addComponentDataFromComponent';

export const migrations = [
  CreateApp1686744033397,
  CreateForm1686744042985,
  CreateComponent1686744049159,
  CreateFormPermission1686744063864,
  CreateFormTemplate1686744070031,
  CreateTheme1686744077833,
  AddFormStatus1686812180878,
  RemoveAllTableDeleted1686831139363,
  UpdateFormAndPermission1686880628843,
  UpdateAllCreatorId1686884780374,
  CreateFormStore1686896869942,
  UpdateFormTemplate1686910481462,
  UpdateComponent1686911420401,
  AddFromColumns1687160311778,
  AddFormScene1687174439017,
  AddTableNameForFormStore1687700611399,
  AddPublishFieldFromForm1687850164758,
  AddFormAndDataPermissionsFromFormPermission1687856139669,
  AddComponentDataFromComponent1688117466349,
];

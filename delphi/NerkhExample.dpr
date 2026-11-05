/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

program NerkhExample;

{$APPTYPE CONSOLE}
{$CODEPAGE UTF8}

uses
  System.SysUtils,
  System.Net.HttpClient,
  System.Net.URLClient,
  System.JSON;

const
  // ---------------------------------------------------------------
  // تنظیمات — این بخش را تغییر دهید
  // ---------------------------------------------------------------
  BASE_URL  = 'https://api.nerkh.io';   // آدرس پایه API
  ENDPOINT  = '/v2/prices/json/all';    // مسیر همه قیمت‌ها (V2 - JSON)
  API_TOKEN = 'YOUR_TOKEN_HERE';        // توکن Bearer خود را اینجا قرار دهید
  // ---------------------------------------------------------------

// خواندن یک مقدار متنی از JSON با مقدار پیش‌فرض
function JsonText(Obj: TJSONObject; const Name: string): string;
var
  Value: TJSONValue;
begin
  Value := Obj.GetValue(Name);
  if Value = nil then
    Result := '-'
  else
    Result := Value.Value;
end;

var
  HttpClient: THTTPClient;
  Response: IHTTPResponse;
  Headers: TNetHeaders;
  Root, Data, Prices, Items, Item: TJSONObject;
  GroupNames: array[0..2] of string;
  GroupLabels: array[0..2] of string;
  Pair: TJSONPair;
  I, J, Total: Integer;
  Current, Change, Update: string;

begin
  GroupNames[0] := 'gold';     GroupLabels[0] := 'طلا';
  GroupNames[1] := 'currency'; GroupLabels[1] := 'ارز';
  GroupNames[2] := 'crypto';   GroupLabels[2] := 'کریپتو';

  // ارسال درخواست GET همراه با توکن
  Headers := [
    TNetHeader.Create('Accept', 'application/json'),
    TNetHeader.Create('Authorization', 'Bearer ' + API_TOKEN)
  ];

  HttpClient := THTTPClient.Create;
  try
    try
      Response := HttpClient.Get(BASE_URL + ENDPOINT, nil, Headers);
    except
      on E: Exception do
      begin
        Writeln(ErrOutput, 'خطای اتصال: ' + E.Message);
        ExitCode := 1;
        Exit;
      end;
    end;

    // بررسی موفقیت پاسخ
    if Response.StatusCode <> 200 then
    begin
      Writeln(ErrOutput, Format('خطای HTTP: %d', [Response.StatusCode]));
      Writeln(ErrOutput, Response.ContentAsString);
      ExitCode := 1;
      Exit;
    end;

    // تبدیل پاسخ JSON
    Root := TJSONObject.ParseJSONValue(Response.ContentAsString) as TJSONObject;
    if Root = nil then
    begin
      Writeln(ErrOutput, 'پاسخ JSON نامعتبر است');
      ExitCode := 1;
      Exit;
    end;

    try
      Data := Root.GetValue('data') as TJSONObject;
      if Data = nil then
      begin
        Writeln(ErrOutput, 'ساختار پاسخ نامعتبر است');
        ExitCode := 1;
        Exit;
      end;

      Prices := Data.GetValue('prices') as TJSONObject;
      if Prices = nil then
        Prices := Data;

      // نمایش همه آیتم‌ها، گروه‌بندی‌شده
      Total := 0;
      for I := 0 to 2 do
      begin
        if not (Prices.GetValue(GroupNames[I]) is TJSONObject) then
          Continue;

        Items := TJSONObject(Prices.GetValue(GroupNames[I]));
        Writeln;
        Writeln(Format('=== %s (%d آیتم) ===', [GroupLabels[I], Items.Count]));
        Writeln(Format('%-20s %16s %10s  %s',
          ['نماد', 'قیمت', 'تغییر ۲۴س', 'به‌روزرسانی']));

        for J := 0 to Items.Count - 1 do
        begin
          Pair := Items.Pairs[J];
          Item := Pair.JsonValue as TJSONObject;
          Current := JsonText(Item, 'current');
          Change := JsonText(Item, 'ch_24h_percent');
          Update := JsonText(Item, 'update');

          Writeln(Format('%-20s %16s %10s  %s',
            [Pair.JsonString.Value, Current, Change + '%', Update]));
          Inc(Total);
        end;
      end;

      Writeln;
      Writeln(Format('مجموع: %d آیتم', [Total]));
    finally
      Root.Free;
    end;
  finally
    HttpClient.Free;
  end;
end.

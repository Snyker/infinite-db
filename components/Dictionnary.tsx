import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {TypographyH4, TypographyMuted} from "@/components/ui/text";
import {DialogDBTable} from "@/components/dialog/DialogDBTable";
import {BsDatabaseAdd} from "react-icons/bs";
import React, {useContext} from "react";
import {TableContext} from "@/contexts/table.context";
import {DictionnaryTable} from "@/components/tables/DictionnaryTable";
import {DialogDBExport} from "@/components/dialog/DialogDBExport";
import {TbDatabaseExport} from "react-icons/tb";

export const Dictionnary = () => {

  const tableCtx = useContext(TableContext);

  return (
    <Card className={'absolute top-4 left-4 bottom-4 z-10'}>
      <CardHeader className={'flex-row gap-4 items-baseline justify-around'}>
        <TypographyH4>Dictionnaire</TypographyH4>
        <DialogDBTable>
          <BsDatabaseAdd title={"Ajouter une table"} size={24} className={'text-primary cursor-pointer'}/>
        </DialogDBTable>
        <DialogDBExport>
          <TbDatabaseExport title={"Exporter"} size={24} className={'text-primary cursor-pointer'} />
        </DialogDBExport>
      </CardHeader>
      <CardContent className={'gap-2 flex flex-col'}>
        {
          tableCtx.tables && tableCtx.tables.length == 0 ?
            <TypographyMuted>No table found.</TypographyMuted> :
            tableCtx.tables.map((table, index) => (
              <DictionnaryTable table={table} key={`_table-${index}`} />
            ))
        }
      </CardContent>
    </Card>
  );
};

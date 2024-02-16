import {MysqlTypeIndexes, MysqlTypeTypes, TableType} from "@/services/mysql.service";
import {TypographyH4, TypographyLead, TypographySmall} from "@/components/ui/text";
import {Badge} from "@/components/ui/badge";
import {MdDelete, MdEdit} from "react-icons/md";
import {DialogDBTable} from "@/components/dialog/DialogDBTable";
import {useContext} from "react";
import {TableContext} from "@/contexts/table.context";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

export type DictionnaryTableProps = {
  table: TableType;
}

export const DictionnaryTable = ({ table } : DictionnaryTableProps) => {

  const tableContext = useContext(TableContext);

  const renderType = (type: MysqlTypeTypes, length: string) => {
    return <TypographySmall className={'text-[0.55rem] text-white mix-blend-difference'}>{type} {length && `(${length})`}</TypographySmall>
  }

  const renderIndex = (index: MysqlTypeIndexes) => {
    let tag = "";
    switch (index) {
      case "primary":
        tag = "PK";
        break;
      case "index":
        tag = "I";
        break;
      case "unique":
        tag = "U";
        break;
      default:
        break;
    }
    return <TypographySmall className={'text-[0.65rem] text-white mix-blend-difference'}>{tag}</TypographySmall>
  }

  const handleDeleteTable = (e: any) => {
    e.preventDefault();
    tableContext.removeTable(table);
  }

  return (
    <div className={`flex flex-col gap-0.5 flex-1 border border-foreground rounded p-1 w-full md:min-w-60 shadow`} style={{backgroundColor: table.color}}>
      <div className={'flex flex-row gap-2 justify-between'}>
        <TypographyH4 className={'text-white mix-blend-difference'}>{table.name}</TypographyH4>
        <div className={'flex flex-row gap-1 items-center'}>
          <Badge variant={'destructive'} className={'text-white bg-stone-600 border-foreground border'} >{table.key}</Badge>
          <DialogDBTable value={table}>
            <Button variant={'outline'} size={'icon'}>
              <MdEdit size={16} className={'text-blue-500'} />
            </Button>
          </DialogDBTable>
          <Button variant={'outline'} size={'icon'} onClick={handleDeleteTable}>
            <MdDelete size={16} className={'text-red-500'} />
          </Button>

        </div>
      </div>
      <div className={'flex flex-col gap-1 ml-0.5'}>
        {
          table.columns && table.columns.map((col) => (
            <div className={'grid grid-cols-3 gap-2'}>
              <TypographySmall className={'text-white mix-blend-difference'}>{col.name}</TypographySmall>
              {renderType(col.type, col.length)}
              {renderIndex(col.index)}
            </div>
          ))
        }
        {
          table.relations && table.relations.length >= 1 ? (
            <>
              <Separator className={'my-0.5 mix-blend-difference bg-white'} />
              {
                table.relations.map((rel) => (
                  <div className={'grid grid-cols-3 gap-2'}>
                    <TypographySmall className={'text-white mix-blend-difference'}>{rel.table}.{rel.name}</TypographySmall>
                    {renderType("int", "")}
                    {renderIndex("index")}
                  </div>
                ))
              }
            </>
          ) : null
        }
      </div>
    </div>
  );
};

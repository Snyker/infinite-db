"use client"

import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React, {useContext, useEffect, useRef, useState} from "react";
import {TypographyH1, TypographyP} from "@/components/ui/text";
import {Form, FormControl, FormField, FormGroup, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  MysqlColumnAttributs,
  MysqlColumnGroupTypes, MysqlColumnGroupTypesDefault,
  MysqlColumnIndexes,
  MysqlColumnTypes,
  TableType
} from "@/services/mysql.service";
import {Checkbox} from "@/components/ui/checkbox";
import {BsDatabaseFillAdd} from "react-icons/bs";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {TableContext} from "@/contexts/table.context";
import {MdDelete} from "react-icons/md";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {TbCirclesRelation} from "react-icons/tb";
import { v4 as randomUUID} from 'uuid';
import {GraphContext} from "@/contexts/graph.context";
import {CheckboxIndicator} from "@radix-ui/react-checkbox";
import {Label} from "@/components/ui/label";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {FaInfo} from "react-icons/fa";

const formSchema = z.object({
  uid: z.string().optional().default(randomUUID()),
  name: z.string().regex(/^[a-z_]*$/, {
    message: "Table name must be only characters"
  }).min(2, {
    message: "Table name must be at least 2 characters.",
  }),
  key: z.string(),
  color: z.string().optional(),
  relations: z.array(z.object({
    uid: z.string().optional(),
    table: z.string(),
    tableId: z.string(),
    name: z.string().min(1, {
      message: "Une colonne doit être séléctionnée."
    }),
  })),
  columns: z.array(z.object({
    uid: z.string().optional().default(randomUUID()),
    name: z.string().min(1, {
      message: 'Column name must be at least 1 character'
    }),
    type: z.enum(MysqlColumnTypes).default("int"),
    length: z.string().optional(),
    default: z.string().optional(),
    nullable: z.boolean().default(false),
    index: z.enum(MysqlColumnIndexes).default("none"),
    autoincrement: z.boolean().default(false),
    attribut: z.enum(MysqlColumnAttributs).default("none").optional()
  }))
})

const getDefaultValues = (): z.infer<typeof formSchema> => ({
  uid: randomUUID(),
  name: "entity",
  key: "e",
  color: "#e8c77f",
  relations: [],
  columns: [
    {
      uid: randomUUID(),
      name: "id",
      type: "int",
      length: "",
      default: "",
      nullable: false,
      index: "primary",
      attribut: "none",
      autoincrement: true
    }
  ]
});

export const DialogDBTable = ({ value, children }: React.PropsWithChildren<{ value?: TableType }>) => {

  const [open, setOpen] = useState(false);
  const [autofill, setAutofill] = useState(true);

  const tableContext = useContext(TableContext);
  const graphContext = useContext(GraphContext);

  const [errorCreate, setErrorCreate] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: value,
    defaultValues: getDefaultValues(),
  });

  /**
   * Represents the field columns in a table.
   */
  const { fields: fieldColumns, append, remove } = useFieldArray({
    control: form.control,
    name: "columns"
  });

  /**
   * The `fieldRelations` variable represents a mapping of fields and their corresponding relations.
   */
  const { fields: fieldRelations, append: appendRelation, remove: removeRelation } = useFieldArray({
    control: form.control,
    name: "relations"
  })

  /**
   * Handles the form submission event.
   *
   * @param {object} values - The form values.
   */
  function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorCreate(false);

    //Si un edit
    if(value) {
      tableContext.editTable(values as TableType);
      form.reset(getDefaultValues);
      setOpen(false);
    }
    else {
      if(tableContext.addTable(values as TableType)) {
        form.reset(getDefaultValues());
        setOpen(false);
      } else {
        setErrorCreate(true);
      }
    }
  }

  /**
   * Handles adding a new column to a form.
   *
   * @param {React.MouseEvent} e - The mouse event triggering the function.
   */
  const handleAddColumn = (e: React.MouseEvent) => {
    e.preventDefault();
    append({ name: "", attribut: "none", type: "varchar", length: "", nullable: false, index: "none", autoincrement: false, uid: randomUUID() });
  };

  /**
   * Handle remove column event.
   *
   * @param {React.MouseEvent} e - The event object.
   * @param {number} colIndex - The index of the column to be removed.
   */
  const handleRemoveColumn = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    remove(colIndex)
  }

  /**
   * Handles the addition of a relation.
   *
   * @param {React.MouseEvent} e - The mouse event that triggered the addition.
   */
  const handleAddRelation = (e: React.MouseEvent) => {
    e.preventDefault();
    appendRelation({
      name: "",
      table: "",
      tableId: "",
      uid: randomUUID()
    })
  }

  /**
   * Function to handle the removal of a relation.
   *
   * @param {React.MouseEvent} e - The mouse event that triggered the removal.
   * @param {number} relIndex - The index of the relation to be removed.
   */
  const handleRemoveRelation = (e: React.MouseEvent, relIndex: number) => {
    e.preventDefault();
    removeRelation(relIndex);
  }

  useEffect(() => {
    console.log('dialog db table effet')
    console.log('updated only on table ?')
    console.log('table: ', value);
  }, [value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={'max-w-[96%] w-full'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <TypographyH1>Propriétés de la table</TypographyH1>
              </DialogTitle>
              <DialogDescription>Définissez les propriétés de votre table, les options, couleur et
                autre.</DialogDescription>
              {
                errorCreate && <TypographyP className={'text-red-500'}>Une entité avec le même code existe déjà.</TypographyP>
              }
            </DialogHeader>
            <Separator className={'my-4'} />
            {/* Titre ; Clé ; Couleur*/}
            <FormGroup className={'justify-center'}>
              <FormField name={"name"}
                         control={form.control}
                         render={({field}) => (
                           <FormItem>
                             <FormLabel>Nom de la table</FormLabel>
                             <FormControl>
                               <Input value={field.value} onChange={(e) => {
                                 field.onChange(e);
                                 if(autofill) {
                                   const key = e.target.value.split("_").map(c => c.charAt(0)).join("");
                                   form.setValue("key", key || 'e', {
                                     shouldDirty: true,
                                     shouldValidate: true
                                   })
                                 }
                               }} placeholder={"my_entity_or_relation"} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}/>
              <FormField name={"key"}
                         control={form.control}
                         render={({field}) => (
                           <FormItem>
                             <FormLabel>Préfix Relation</FormLabel>
                             <FormControl>
                               <Input placeholder={"e"} {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}/>
              <FormField name={"color"}
                         control={form.control}
                         render={({field}) => (
                           <FormItem>
                             <FormLabel>Couleur</FormLabel>
                             <FormControl>
                               <Input type={'color'} placeholder={"e"} {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}/>
            </FormGroup>
            {/* Autofill de la clé */}
            <div className={"items-top flex space-x-2 my-2"}>
              <Checkbox id={"autofill"}
                        checked={autofill}
                        onCheckedChange={e => setAutofill(Boolean(e))}
                        />
              <Label>
                Autofill la clé en fonction du nom
              </Label>
            </div>
            <Separator className={'my-4'} />
            {/* Colonnes ; Relations */}
            <Tabs defaultValue={"columns"}>
              <TabsList className={'grid grid-cols-2'}>
                <TabsTrigger value={"columns"}>Colonnes</TabsTrigger>
                <TabsTrigger value={"relations"}>Relations</TabsTrigger>
              </TabsList>
              <TabsContent value={"columns"}>
                <Table parentClassName={'max-h-96 overflow-y-scroll'} >
                  <TableHeader className={'bg-secondary sticky top-0 z-10'}>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className={'items-center space-x-2'}>
                        Valeur/Taille
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FaInfo size={12} className={'text-primary rounded-full ml-2 border p-0.5 bg-secondary h-4 w-4'} />
                            </TooltipTrigger>
                            <TooltipContent className={'transform translate-y-20'}>
                              <p>
                                Si les colonnes sont de type "enum" ou "set", merci de saisir les valeurs sous la form 'a','b','c'...
                              </p>
                              <p>
                                S'il faut saisir une barre oblique inverse (\) ou une apostrophe (') dans l'une de ces valeurs, la faire précèder d'une barre oblique inverse (\\xyz)                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableHead>
                      <TableHead>Défaut</TableHead>
                      <TableHead>Index</TableHead>
                      <TableHead>Nullable</TableHead>
                      <TableHead>Auto Increment</TableHead>
                      <TableHead>Attribut</TableHead>
                      <TableHead>Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      fieldColumns.map((row, index) => (
                        <TableRow key={`_row-${row.uid}`}>
                          <TableCell>
                            <FormField name={`columns.${index}.name`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <FormControl>
                                             <Input placeholder={"name"} {...field} />
                                           </FormControl>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell>
                            <FormField name={`columns.${index}.type`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                               <SelectTrigger>
                                                 <SelectValue placeholder="Select a valid type" />
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               {
                                                 MysqlColumnGroupTypes.flatMap((category, index, array) => {
                                                   const result = [
                                                     <SelectGroup key={category.name}>
                                                       <SelectLabel>{category.name}</SelectLabel>
                                                       {
                                                         category.values.map((item, index) => (
                                                           <SelectItem key={`${item}_${index}`} value={item}>{item}</SelectItem>
                                                         ))
                                                       }
                                                     </SelectGroup>
                                                   ];
                                                   if (index < array.length - 1) {
                                                     result.push(<Separator key={`_sep${index}`} />);
                                                   }
                                                   return result;
                                                 })
                                               }
                                             </SelectContent>
                                           </Select>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell>
                            <FormField name={`columns.${index}.length`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <FormControl>
                                             <Input placeholder={"length or value"} {...field} />
                                           </FormControl>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell>
                            <FormField name={`columns.${index}.default`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <FormControl>
                                             <Input placeholder={"abc ; 50"} {...field} />
                                           </FormControl>
                                           <FormMessage/>
                                         </FormItem>
                                       )}/>
                            <div className={'grid grid-cols-2 mt-2'}>
                              <div className={'flex flex-row space-x-2 items-center'}>
                                <Checkbox id={"length_nullable"}
                                          checked={form.getValues(`columns.${index}.default`) === "NULL"}
                                          onCheckedChange={e => {
                                            form.setValue(`columns.${index}.default`, e ? 'NULL' : '', {
                                              shouldDirty: true,
                                              shouldValidate: true
                                            })
                                          }}
                                />
                                <Label htmlFor={"length_nullable"} className={'cursor-pointer'}>
                                  Null
                                </Label>
                              </div>
                              <div className={'flex flex-row space-x-2 items-center'}>
                                <Checkbox id={"length_timestamp"}
                                          checked={form.getValues(`columns.${index}.default`) === "CURRENT_TIMESTAMP"}
                                          onCheckedChange={e => {
                                            form.setValue(`columns.${index}.default`, e ? 'CURRENT_TIMESTAMP' : '', {
                                              shouldDirty: true,
                                              shouldValidate: true
                                            })
                                          }}
                                />
                                <Label htmlFor={"length_timestamp"} className={'cursor-pointer'}>
                                  Current Time
                                </Label>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <FormField name={`columns.${index}.index`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                               <SelectTrigger>
                                                 <SelectValue placeholder="Select a valid index"/>
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               {
                                                 MysqlColumnIndexes.map((item) => (
                                                   <SelectItem key={item} value={item}>{item}</SelectItem>
                                                 ))
                                               }
                                             </SelectContent>
                                           </Select>
                                           <FormMessage/>
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell>
                            <FormField name={`columns.${index}.nullable`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <FormControl>
                                             <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                           </FormControl>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell>
                            <FormField name={`columns.${index}.autoincrement`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <FormControl>
                                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                           </FormControl>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell>
                            <FormField name={`columns.${index}.attribut`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                               <SelectTrigger>
                                                 <SelectValue placeholder="Select a valid attribut"/>
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               {
                                                 MysqlColumnAttributs.map((item) => (
                                                   <SelectItem key={item} value={item}>{item}</SelectItem>
                                                 ))
                                               }
                                             </SelectContent>
                                           </Select>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell className={'flex flex-row gap-2'}>
                            <Button variant={'outline'} size={'icon'} onClick={e => handleRemoveColumn(e, index)}>
                              <MdDelete size={16} className={'text-red-500'} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                <Button className={'w-full gap-2'} variant={'ghost'} onClick={handleAddColumn}>
                  <BsDatabaseFillAdd size={24} />
                  Ajouter une colonne
                </Button>
              </TabsContent>
              {/* RELATIONS */}
              <TabsContent value={"relations"}>
                <Table parentClassName={'max-h-96 overflow-y-scroll'}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table</TableHead>
                      <TableHead>Colonne</TableHead>
                      <TableHead>Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      fieldRelations.map((relation, index) => (
                        <TableRow key={relation.uid}>
                          <TableCell>
                            <FormField name={`relations.${index}.table`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <Select onValueChange={(e) => {
                                             const [uid, name] = e.split('|');
                                             field.onChange(name);
                                             form.setValue(`relations.${index}.tableId`, uid, {
                                               shouldDirty: true,
                                               shouldValidate: true
                                             });
                                             form.setValue(`relations.${index}.name`, "", {
                                               shouldDirty: true,
                                               shouldValidate: true
                                             });
                                           }} value={`${form.getValues(`relations.${index}.tableId`)}|${field.value}`}>
                                             <FormControl>
                                               <SelectTrigger>
                                                 <SelectValue placeholder="Select a valid table"/>
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               {
                                                 tableContext.tableIdsAndNames().map((item) => (
                                                   <SelectItem key={item} value={item}>{item.split('|')[1]}</SelectItem>
                                                 ))
                                               }
                                             </SelectContent>
                                           </Select>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell>
                            <FormField name={`relations.${index}.name`}
                                       control={form.control}
                                       render={({field}) => (
                                         <FormItem>
                                           <Select onValueChange={field.onChange} defaultValue={field.value} disabled={form.getValues(`relations.${index}.table`) === ""}>
                                             <FormControl>
                                               <SelectTrigger>
                                                 <SelectValue placeholder="Select a valid column"/>
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               {
                                                 tableContext.columnNames(form.getValues(`relations.${index}.table`)).map((item) => (
                                                   <SelectItem key={item} value={item}>{item}</SelectItem>
                                                 ))
                                               }
                                             </SelectContent>
                                           </Select>
                                           <FormMessage />
                                         </FormItem>
                                       )}/>
                          </TableCell>
                          <TableCell className={'flex flex-row gap-2'}>
                            <Button variant={'outline'} size={'icon'} onClick={e => handleRemoveRelation(e, index)}>
                              <MdDelete size={16} className={'text-red-500'} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                <Button className={'w-full gap-2'} variant={'ghost'} onClick={handleAddRelation}>
                  <TbCirclesRelation size={24} />
                  Ajouter une relation
                </Button>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={'outline'}>Annuler</Button>
              </DialogClose>
              <Button type={"submit"}>Sauvegarder</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
